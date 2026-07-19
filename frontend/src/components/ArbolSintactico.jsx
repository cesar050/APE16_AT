import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * Componente que renderiza el árbol sintáctico de dependencias de forma jerárquica estática.
 * Muestra raíz, ramas y hojas con colores diferenciados, sin interacción de arrastre.
 * @param {Array} dependencias - Lista de dependencias con dep, governor y dependent.
 */
function ArbolSintactico({ dependencias }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!dependencias || dependencias.length === 0) return;

    const width = svgRef.current.clientWidth || 800;
    const height = 460;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // construir mapa de hijos
    const hijosMap = new Map();
    const todosNodos = new Set();
    const tienesPadre = new Set();

    dependencias.forEach((d) => {
      if (d.governor === d.dependent) return;
      todosNodos.add(d.governor);
      todosNodos.add(d.dependent);
      tienesPadre.add(d.dependent);
      if (!hijosMap.has(d.governor)) hijosMap.set(d.governor, []);
      hijosMap.get(d.governor).push({ id: d.dependent, label: d.dep });
    });

    // encontrar raíz (nodo sin padre)
    const raiz = [...todosNodos].find((n) => !tienesPadre.has(n)) || "ROOT";

    // construir árbol jerárquico
    const buildTree = (id) => ({
      id,
      children: (hijosMap.get(id) || []).map((h) => ({
        ...buildTree(h.id),
        edgeLabel: h.label,
      })),
    });

    const treeData = buildTree(raiz);

    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([width - 80, height - 100]);
    treeLayout(root);

    const g = svg.append("g").attr("transform", "translate(40, 50)");

    // determinar tipo de nodo
    const getTipo = (node) => {
      if (!node.parent) return "raiz";
      if (node.children && node.children.length > 0) return "rama";
      return "hoja";
    };

    const getColor = (node) => {
      const tipo = getTipo(node);
      if (tipo === "raiz") return "#f5a623";
      if (tipo === "rama") return "#4a90e2";
      return "#27ae60";
    };

    // enlaces
    g.selectAll(".link")
      .data(root.links())
      .join("line")
      .attr("class", "link")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", "#aaa")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow-tree)");

    // etiquetas de enlaces
    g.selectAll(".edge-label")
      .data(root.links())
      .join("text")
      .attr("class", "edge-label")
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2 - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("fill", "#c5221f")
      .attr("font-weight", "600")
      .text((d) => d.target.data.edgeLabel || "");

    // marcador flecha
    svg.append("defs").append("marker")
      .attr("id", "arrow-tree")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#aaa");

    // nodos
    const node = g.selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    node.append("circle")
      .attr("r", 22)
      .attr("fill", (d) => getColor(d))
      .attr("stroke", "white")
      .attr("stroke-width", 2.5);

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "10px")
      .attr("font-weight", "700")
      .attr("fill", "white")
      .text((d) => d.data.id.length > 7 ? d.data.id.slice(0, 6) + "…" : d.data.id);

    // leyenda
    const leyenda = svg.append("g").attr("transform", `translate(${width - 110}, 20)`);
    const items = [
      { color: "#f5a623", label: "Raíz" },
      { color: "#4a90e2", label: "Rama" },
      { color: "#27ae60", label: "Hoja" },
    ];
    items.forEach((item, i) => {
      leyenda.append("circle").attr("cx", 8).attr("cy", i * 22).attr("r", 8).attr("fill", item.color);
      leyenda.append("text").attr("x", 22).attr("y", i * 22 + 4).attr("font-size", "11px").attr("fill", "#333").text(item.label);
    });

  }, [dependencias]);

  return (
    <section>
      <h2>Árbol Sintáctico</h2>
      <div style={{ background: "white", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "10px" }}>
        <svg ref={svgRef} style={{ width: "100%", height: "460px" }} />
      </div>
    </section>
  );
}

export default ArbolSintactico;