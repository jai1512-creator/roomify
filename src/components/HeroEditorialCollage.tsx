import React from "react"
import styles from "./heroCollage.module.css"

export function FloorPlanSvg() {
  return (
    <svg
      className={styles.floorPlanLinework}
      viewBox="0 0 580 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer & Inner Architectural Wall Boundaries */}
      <rect x="40" y="40" width="480" height="380" stroke="#1d1c19" strokeWidth="1.4" strokeOpacity="0.12" />
      <rect x="46" y="46" width="468" height="368" stroke="#1d1c19" strokeWidth="0.8" strokeOpacity="0.08" />

      {/* Grid Guide Lines & Center Axis */}
      <line x1="40" y1="230" x2="520" y2="230" stroke="#1d1c19" strokeWidth="0.6" strokeDasharray="4 6" strokeOpacity="0.09" />
      <line x1="280" y1="40" x2="280" y2="420" stroke="#1d1c19" strokeWidth="0.6" strokeDasharray="4 6" strokeOpacity="0.09" />

      {/* Doorway & Swing Arc (Entryway) */}
      <line x1="40" y1="320" x2="40" y2="380" stroke="#f4f1eb" strokeWidth="4" />
      <line x1="40" y1="320" x2="90" y2="320" stroke="#1d1c19" strokeWidth="1" strokeOpacity="0.18" />
      <path d="M 90 320 A 50 50 0 0 1 40 370" fill="none" stroke="#1d1c19" strokeWidth="0.8" strokeDasharray="2 3" strokeOpacity="0.16" />

      {/* Window Openings with Double Sill Lines */}
      <line x1="160" y1="40" x2="320" y2="40" stroke="#f4f1eb" strokeWidth="4" />
      <line x1="160" y1="38" x2="320" y2="38" stroke="#1d1c19" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="160" y1="43" x2="320" y2="43" stroke="#1d1c19" strokeWidth="0.8" strokeOpacity="0.14" />

      {/* Living Room Area Rug & Furniture Silhouettes */}
      <rect x="120" y="110" width="220" height="180" stroke="#1d1c19" strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.11" />
      
      {/* Sofa (Main 3-seater outline + cushions) */}
      <rect x="140" y="130" width="180" height="50" rx="4" stroke="#1d1c19" strokeWidth="1" strokeOpacity="0.15" />
      <line x1="200" y1="130" x2="200" y2="180" stroke="#1d1c19" strokeWidth="0.6" strokeOpacity="0.1" />
      <line x1="260" y1="130" x2="260" y2="180" stroke="#1d1c19" strokeWidth="0.6" strokeOpacity="0.1" />
      
      {/* Coffee Table & Lounge Chairs */}
      <rect x="180" y="200" width="100" height="42" rx="2" stroke="#1d1c19" strokeWidth="0.9" strokeOpacity="0.14" />
      <circle cx="145" cy="220" r="16" stroke="#1d1c19" strokeWidth="0.8" strokeOpacity="0.12" />
      <circle cx="315" cy="220" r="16" stroke="#1d1c19" strokeWidth="0.8" strokeOpacity="0.12" />

      {/* Architectural Dimension Lines with Ticks */}
      <line x1="40" y1="20" x2="520" y2="20" stroke="#1d1c19" strokeWidth="0.7" strokeOpacity="0.15" />
      <line x1="40" y1="14" x2="40" y2="26" stroke="#1d1c19" strokeWidth="1" strokeOpacity="0.25" />
      <line x1="520" y1="14" x2="520" y2="26" stroke="#1d1c19" strokeWidth="1" strokeOpacity="0.25" />
      <text x="260" y="16" fill="#1d1c19" fillOpacity="0.22" fontSize="9" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">
        24'-0" [WALL SPAN]
      </text>

      <line x1="540" y1="40" x2="540" y2="420" stroke="#1d1c19" strokeWidth="0.7" strokeOpacity="0.15" />
      <line x1="534" y1="40" x2="546" y2="40" stroke="#1d1c19" strokeWidth="1" strokeOpacity="0.25" />
      <line x1="534" y1="420" x2="546" y2="420" stroke="#1d1c19" strokeWidth="1" strokeOpacity="0.25" />
      <text x="555" y="235" fill="#1d1c19" fillOpacity="0.22" fontSize="9" fontFamily="sans-serif" textAnchor="middle" transform="rotate(90 555 235)" letterSpacing="1">
        18'-6" [CLEAR]
      </text>

      {/* Technical Blueprint Annotations */}
      <text x="140" y="80" fill="#1d1c19" fillOpacity="0.24" fontSize="8.5" fontFamily="monospace" letterSpacing="1.2">
        SEC. 01 // MAIN LIVING PERSPECTIVE
      </text>
      <text x="140" y="94" fill="#1d1c19" fillOpacity="0.18" fontSize="7.5" fontFamily="monospace">
        SCALE: 1/4" = 1'-0"  |  N.T.S.
      </text>
      <text x="360" y="340" fill="#1d1c19" fillOpacity="0.2" fontSize="8" fontFamily="monospace">
        CIRCULATION AXIS &gt;&gt;
      </text>

      {/* Corner Precision Crosshairs (+) */}
      <g stroke="#1d1c19" strokeWidth="0.8" strokeOpacity="0.25">
        <path d="M 35 40 L 45 40 M 40 35 L 40 45" />
        <path d="M 515 40 L 525 40 M 520 35 L 520 45" />
        <path d="M 35 420 L 45 420 M 40 415 L 40 425" />
        <path d="M 515 420 L 525 420 M 520 415 L 520 425" />
      </g>
    </svg>
  )
}

export function PerspectiveWireframeSvg() {
  return (
    <svg
      className={styles.perspectiveWireframe}
      viewBox="0 0 660 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Upper Architectural Perspective & Ceiling Grid */}
      <line x1="40" y1="40" x2="310" y2="180" stroke="#1d1c19" strokeWidth="0.8" strokeOpacity="0.14" />
      <line x1="620" y1="40" x2="350" y2="180" stroke="#1d1c19" strokeWidth="0.8" strokeOpacity="0.14" />
      <line x1="40" y1="40" x2="620" y2="40" stroke="#1d1c19" strokeWidth="0.8" strokeOpacity="0.16" />

      {/* Architectural Arches & Window Framing (Echoing editorial reference) */}
      <path
        d="M 120 180 L 120 70 A 50 50 0 0 1 220 70 L 220 180"
        stroke="#1d1c19"
        strokeWidth="1"
        strokeOpacity="0.18"
      />
      <path
        d="M 130 180 L 130 75 A 40 40 0 0 1 210 75 L 210 180"
        stroke="#1d1c19"
        strokeWidth="0.6"
        strokeOpacity="0.12"
      />
      <path
        d="M 440 180 L 440 70 A 50 50 0 0 1 540 70 L 540 180"
        stroke="#1d1c19"
        strokeWidth="1"
        strokeOpacity="0.18"
      />
      <path
        d="M 450 180 L 450 75 A 40 40 0 0 1 530 75 L 530 180"
        stroke="#1d1c19"
        strokeWidth="0.6"
        strokeOpacity="0.12"
      />

      {/* Overhead Statement Pendant Wireframe */}
      <line x1="330" y1="30" x2="330" y2="110" stroke="#1d1c19" strokeWidth="1" strokeOpacity="0.25" />
      <ellipse cx="330" cy="115" rx="35" ry="12" stroke="#1d1c19" strokeWidth="1" strokeOpacity="0.2" />
      <path d="M 295 115 Q 330 85 365 115" stroke="#1d1c19" strokeWidth="0.9" strokeOpacity="0.18" />

      {/* Right Wall Perspective Convergence */}
      <line x1="620" y1="40" x2="620" y2="520" stroke="#1d1c19" strokeWidth="0.9" strokeOpacity="0.15" />
      <line x1="620" y1="520" x2="350" y2="400" stroke="#1d1c19" strokeWidth="0.7" strokeDasharray="3 4" strokeOpacity="0.12" />

      {/* Dimension Line & Measurement Top */}
      <line x1="80" y1="20" x2="580" y2="20" stroke="#1d1c19" strokeWidth="0.7" strokeOpacity="0.18" />
      <line x1="80" y1="15" x2="80" y2="25" stroke="#1d1c19" strokeWidth="1.2" strokeOpacity="0.25" />
      <line x1="580" y1="15" x2="580" y2="25" stroke="#1d1c19" strokeWidth="1.2" strokeOpacity="0.25" />
      <text x="330" y="16" fill="#1d1c19" fillOpacity="0.3" fontSize="9" fontFamily="monospace" textAnchor="middle" letterSpacing="1">
        16'-4" ELEVATION CLEARANCE
      </text>

      {/* Corner Registration Crosshair Marks */}
      <g stroke="#1d1c19" strokeWidth="0.8" strokeOpacity="0.3">
        <path d="M 20 25 L 30 25 M 25 20 L 25 30" />
        <path d="M 630 25 L 640 25 M 635 20 L 635 30" />
        <path d="M 630 580 L 640 580 M 635 575 L 635 585" />
      </g>
    </svg>
  )
}

export function ArchitecturalDrawingFragment() {
  return (
    <svg
      className={styles.architecturalDrawingSvg}
      viewBox="0 0 460 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Wall section cut diagonal hatching */}
        <pattern id="archWallHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#2a2824" strokeWidth="0.8" strokeOpacity="0.3" />
        </pattern>
        {/* Fluted tambour wood texture */}
        <pattern id="archTambour" width="4" height="8" patternUnits="userSpaceOnUse">
          <line x1="2" y1="0" x2="2" y2="8" stroke="#2a2824" strokeWidth="0.5" strokeOpacity="0.25" />
        </pattern>
        {/* Cane webbing / mesh pattern for chair */}
        <pattern id="archCaneMesh" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M 0 2 L 4 2 M 2 0 L 2 4" stroke="#2a2824" strokeWidth="0.4" strokeOpacity="0.22" />
        </pattern>
        {/* Subtle drop shadow filter for the vellum sheet */}
        <filter id="vellumShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="-4" dy="8" stdDeviation="12" floodColor="#1d1c19" floodOpacity="0.08" />
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1d1c19" floodOpacity="0.04" />
        </filter>
      </defs>

      {/* 1. Torn / Deckled Vellum Sheet Base */}
      <path
        d="M 14 10 
           Q 65 6 125 10 Q 185 7 245 9 Q 310 6 375 10 Q 420 7 452 14
           L 456 22 Q 452 65 456 120 Q 459 180 454 245 Q 457 320 452 385 Q 455 405 448 412
           L 438 415 Q 370 411 310 415 Q 235 412 165 414 Q 90 411 35 416 Q 16 412 12 404
           L 8 395 Q 12 320 8 245 Q 5 165 9 95 Q 7 45 14 10 Z"
        fill="#f3efe6"
        fillOpacity="0.97"
        stroke="#2a2824"
        strokeWidth="0.6"
        strokeOpacity="0.16"
        filter="url(#vellumShadow)"
      />

      {/* Drafting tape accent at top right corner */}
      <polygon points="380,4 425,4 420,18 375,18" fill="#dfd4bf" fillOpacity="0.65" stroke="#2a2824" strokeWidth="0.4" strokeOpacity="0.15" />

      {/* Faint Background Drafting Grid inside sheet */}
      <g stroke="#2a2824" strokeWidth="0.4" strokeOpacity="0.07" strokeDasharray="3 4">
        <line x1="30" y1="95" x2="435" y2="95" />
        <line x1="30" y1="175" x2="435" y2="175" />
        <line x1="30" y1="255" x2="435" y2="255" />
        <line x1="140" y1="45" x2="140" y2="390" />
        <line x1="280" y1="45" x2="280" y2="390" />
      </g>

      {/* Sheet Title & Technical Header */}
      <text x="35" y="32" fill="#2a2824" fillOpacity="0.6" fontSize="8" fontFamily="monospace" letterSpacing="1.2">
        FIG. 02 — ARCHITECTURAL ELEVATION &amp; JOINERY STUDY
      </text>
      <text x="35" y="43" fill="#2a2824" fillOpacity="0.38" fontSize="7" fontFamily="monospace">
        SCALE 1:20 // LIVING WALL ELEVATION B-B&apos;
      </text>

      {/* Ceiling Reference Datum */}
      <line x1="30" y1="78" x2="435" y2="78" stroke="#2a2824" strokeWidth="0.7" strokeDasharray="6 3 2 3" strokeOpacity="0.25" />
      <text x="435" y="74" fill="#2a2824" fillOpacity="0.38" fontSize="7" fontFamily="monospace" textAnchor="end">
        ▲ CEILING DATUM +10&apos;-4&quot;
      </text>

      {/* Floor Datum & Subfloor Section Cut */}
      <line x1="30" y1="350" x2="435" y2="350" stroke="#2a2824" strokeWidth="1.4" strokeOpacity="0.65" />
      <rect x="30" y="351" width="405" height="16" fill="url(#archWallHatch)" stroke="#2a2824" strokeWidth="0.5" strokeOpacity="0.2" />
      <text x="435" y="378" fill="#2a2824" fillOpacity="0.38" fontSize="7" fontFamily="monospace" textAnchor="end">
        ▼ FINISH FLOOR ±0.00
      </text>

      {/* Left Wall Section Cut */}
      <rect x="30" y="78" width="22" height="272" fill="url(#archWallHatch)" stroke="#2a2824" strokeWidth="0.8" strokeOpacity="0.3" />

      {/* Arched Architectural Display Alcove */}
      <g>
        {/* Alcove Centerline */}
        <line x1="140" y1="68" x2="140" y2="350" stroke="#2a2824" strokeWidth="0.5" strokeDasharray="12 3 2 3" strokeOpacity="0.2" />
        <text x="140" y="64" fill="#2a2824" fillOpacity="0.4" fontSize="7" fontFamily="monospace" textAnchor="middle">
          ℄
        </text>

        {/* Outer Arch */}
        <path
          d="M 80 350 L 80 165 A 60 60 0 0 1 200 165 L 200 350"
          fill="rgba(42, 38, 32, 0.04)"
          stroke="#2a2824"
          strokeWidth="1.2"
          strokeOpacity="0.45"
        />
        {/* Inner Arch Reveal Line */}
        <path
          d="M 86 350 L 86 168 A 54 54 0 0 1 194 168 L 194 350"
          fill="none"
          stroke="#2a2824"
          strokeWidth="0.6"
          strokeOpacity="0.22"
        />

        {/* Floating Shelves inside Alcove */}
        {/* Upper Shelf */}
        <rect x="85" y="195" width="110" height="4" rx="1" fill="#e8e2d6" stroke="#2a2824" strokeWidth="0.7" strokeOpacity="0.4" />
        {/* Sculptural Ceramic Vessel on Upper Shelf */}
        <path
          d="M 115 195 C 111 187 108 180 112 173 C 114 169 119 169 121 173 C 125 180 122 187 118 195 Z"
          fill="rgba(42, 38, 32, 0.08)"
          stroke="#2a2824"
          strokeWidth="0.8"
          strokeOpacity="0.5"
        />
        {/* Stack of Architecture Monograph Books */}
        <rect x="140" y="186" width="36" height="3" fill="#e8e2d6" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.4" />
        <rect x="142" y="189" width="33" height="3" fill="#dfd7c9" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.4" />
        <rect x="139" y="192" width="38" height="3" fill="#e8e2d6" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.4" />

        {/* Lower Shelf */}
        <rect x="85" y="240" width="110" height="4" rx="1" fill="#e8e2d6" stroke="#2a2824" strokeWidth="0.7" strokeOpacity="0.4" />
        {/* Upright Books & Leaning Book */}
        <rect x="94" y="214" width="4" height="26" fill="#ded7ca" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.4" />
        <rect x="99" y="210" width="5" height="30" fill="#e8e2d6" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.4" />
        <rect x="105" y="212" width="4" height="28" fill="#ded7ca" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.4" />
        <path d="M 110 240 L 121 216 L 126 219 L 115 240 Z" fill="#e8e2d6" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.4" />
        {/* Shallow Ceramic Bowl */}
        <ellipse cx="165" cy="235" rx="15" ry="5" fill="#ded7ca" stroke="#2a2824" strokeWidth="0.7" strokeOpacity="0.45" />
      </g>

      {/* Custom Millwork Credenza / Sideboard */}
      <g>
        {/* Plinth stone top slab */}
        <rect x="70" y="285" width="200" height="5" rx="1" fill="#ded7ca" stroke="#2a2824" strokeWidth="0.9" strokeOpacity="0.5" />
        {/* Main Oak Cabinet Body */}
        <rect x="72" y="290" width="196" height="52" fill="#faf6ef" stroke="#2a2824" strokeWidth="1" strokeOpacity="0.5" />
        {/* 4 Cabinet Door Divisions */}
        <line x1="121" y1="290" x2="121" y2="342" stroke="#2a2824" strokeWidth="0.8" strokeOpacity="0.35" />
        <line x1="170" y1="290" x2="170" y2="342" stroke="#2a2824" strokeWidth="0.8" strokeOpacity="0.35" />
        <line x1="219" y1="290" x2="219" y2="342" stroke="#2a2824" strokeWidth="0.8" strokeOpacity="0.35" />
        {/* Middle Two Bays: Fluted Tambour Pattern */}
        <rect x="121" y="291" width="98" height="50" fill="url(#archTambour)" />
        {/* Hardware pulls */}
        <line x1="117" y1="312" x2="117" y2="320" stroke="#2a2824" strokeWidth="1.2" strokeOpacity="0.6" />
        <line x1="223" y1="312" x2="223" y2="320" stroke="#2a2824" strokeWidth="1.2" strokeOpacity="0.6" />
        {/* Shadow Plinth Base */}
        <rect x="80" y="342" width="180" height="8" fill="rgba(42, 38, 32, 0.08)" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.25" />
      </g>

      {/* Modernist Architectural Lounge Chair Elevation */}
      <g>
        {/* Wooden Tapered Legs */}
        <line x1="295" y1="350" x2="302" y2="295" stroke="#2a2824" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="365" y1="350" x2="342" y2="290" stroke="#2a2824" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="296" y1="332" x2="355" y2="326" stroke="#2a2824" strokeWidth="0.8" strokeOpacity="0.35" />
        {/* Seat Cushion */}
        <rect x="296" y="292" width="58" height="12" rx="3" fill="#e7e0d3" stroke="#2a2824" strokeWidth="1" strokeOpacity="0.5" />
        {/* Cane-Webbing Backrest Frame */}
        <polygon points="344,292 358,225 372,229 356,296" fill="url(#archCaneMesh)" stroke="#2a2824" strokeWidth="1.1" strokeOpacity="0.55" />
        {/* Sculptural Armrest */}
        <path d="M 292 282 L 350 276 L 356 292" fill="none" stroke="#2a2824" strokeWidth="1.3" strokeOpacity="0.55" />
      </g>

      {/* Architectural Wall Sconce */}
      <rect x="238" y="125" width="8" height="18" rx="2" fill="#2a2824" fillOpacity="0.65" />
      <path d="M 242 143 L 218 210 M 242 143 L 266 210" stroke="#2a2824" strokeWidth="0.6" strokeDasharray="3 3" strokeOpacity="0.2" />

      {/* Top Architectural Dimension Strings */}
      <g>
        {/* Extension Lines */}
        <line x1="52" y1="46" x2="52" y2="76" stroke="#2a2824" strokeWidth="0.5" strokeOpacity="0.25" />
        <line x1="200" y1="46" x2="200" y2="76" stroke="#2a2824" strokeWidth="0.5" strokeOpacity="0.25" />
        <line x1="270" y1="46" x2="270" y2="76" stroke="#2a2824" strokeWidth="0.5" strokeOpacity="0.25" />
        {/* Continuous Dimension Line */}
        <line x1="52" y1="52" x2="270" y2="52" stroke="#2a2824" strokeWidth="0.7" strokeOpacity="0.4" />
        {/* 45 Degree Architectural Ticks */}
        <line x1="49" y1="55" x2="55" y2="49" stroke="#2a2824" strokeWidth="1.2" strokeOpacity="0.55" />
        <line x1="197" y1="55" x2="203" y2="49" stroke="#2a2824" strokeWidth="1.2" strokeOpacity="0.55" />
        <line x1="267" y1="55" x2="273" y2="49" stroke="#2a2824" strokeWidth="1.2" strokeOpacity="0.55" />
        {/* Measurement Values */}
        <text x="126" y="49" fill="#2a2824" fillOpacity="0.5" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
          4&apos;-11&quot; [ALCOVE]
        </text>
        <text x="235" y="49" fill="#2a2824" fillOpacity="0.5" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
          2&apos;-4&quot;
        </text>
      </g>

      {/* Vertical Height Dimension String on Right Edge */}
      <g>
        <line x1="412" y1="78" x2="412" y2="350" stroke="#2a2824" strokeWidth="0.7" strokeOpacity="0.4" />
        <line x1="409" y1="81" x2="415" y2="75" stroke="#2a2824" strokeWidth="1.2" strokeOpacity="0.55" />
        <line x1="409" y1="288" x2="415" y2="282" stroke="#2a2824" strokeWidth="1.2" strokeOpacity="0.55" />
        <line x1="409" y1="353" x2="415" y2="347" stroke="#2a2824" strokeWidth="1.2" strokeOpacity="0.55" />
        <text x="424" y="185" fill="#2a2824" fillOpacity="0.45" fontSize="7" fontFamily="monospace" transform="rotate(90 424 185)" textAnchor="middle">
          8&apos;-6&quot; CLEAR
        </text>
        <text x="424" y="318" fill="#2a2824" fillOpacity="0.45" fontSize="7" fontFamily="monospace" transform="rotate(90 424 318)" textAnchor="middle">
          32&quot; PLINTH
        </text>
      </g>

      {/* Technical Leader Lines & Spec Callouts */}
      <g>
        {/* Leader to Tambour Credenza */}
        <polyline points="190,316 230,366 265,366" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.4" fill="none" />
        <circle cx="190" cy="316" r="1.5" fill="#2a2824" fillOpacity="0.6" />
        <text x="270" y="369" fill="#2a2824" fillOpacity="0.55" fontSize="6.5" fontFamily="monospace">
          OAK TAMBOUR JOINERY
        </text>

        {/* Leader to Arched Alcove */}
        <polyline points="155,108 195,95 230,95" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.4" fill="none" />
        <circle cx="155" cy="108" r="1.5" fill="#2a2824" fillOpacity="0.6" />
        <text x="235" y="98" fill="#2a2824" fillOpacity="0.55" fontSize="6.5" fontFamily="monospace">
          PLASTER ALCOVE RELIEF
        </text>

        {/* Circular Detail Marker (Standard Architectural Callout) */}
        <circle cx="395" cy="120" r="12" stroke="#2a2824" strokeWidth="0.8" strokeOpacity="0.45" fill="#f8f5ee" />
        <line x1="383" y1="120" x2="407" y2="120" stroke="#2a2824" strokeWidth="0.6" strokeOpacity="0.45" />
        <text x="395" y="116" fill="#2a2824" fillOpacity="0.6" fontSize="7" fontFamily="monospace" textAnchor="middle">
          02
        </text>
        <text x="395" y="128" fill="#2a2824" fillOpacity="0.6" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          A-4
        </text>
      </g>

      {/* Corner Registration Crosshairs (+) */}
      <g stroke="#2a2824" strokeWidth="0.8" strokeOpacity="0.3">
        <path d="M 20 20 L 28 20 M 24 16 L 24 24" />
        <path d="M 436 20 L 444 20 M 440 16 L 440 24" />
        <path d="M 20 400 L 28 400 M 24 396 L 24 404" />
      </g>
    </svg>
  )
}
