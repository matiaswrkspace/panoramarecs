"use client";

import { useState } from "react";
import { familia } from "@/content";
import Mark from "./Mark";
import Visual from "./Visual";

export default function Familia() {
  const [active, setActive] = useState(0);

  return (
    <section className="familia" id="familia">
      <div className="familia__list">
        <div className="familia__head">
          <h2 className="script">{familia.title}</h2>
          <Mark size={70} />
          <p>{familia.subtitle}</p>
        </div>
        <ul>
          {familia.items.map((item, i) => (
            <li key={item.title}>
              <button className={i === active ? "active" : ""} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}>
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="familia__visual">
        {familia.items.map((item, i) => (
          <Visual key={item.title} item={item} label={item.title} className={i === active ? "active" : ""} />
        ))}
      </div>
    </section>
  );
}
