
import React, { useState, useMemo } from 'react';
import { Timer, Car, Plus, Trash2, Clock, AlertCircle, Save, RotateCcw, Search, AlertTriangle } from 'lucide-react';

// --- DATA CATALOG (Provided by User) ---
const CATALOG = {
  "brands": {
    "Audi": {
      "models": {
        "A3": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "A4": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Q5": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "BMW": {
      "models": {
        "Serie 1": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Serie 3": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "X1": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "X3": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Chery": {
      "models": {
        "Fulwin": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "QQ": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Tiggo": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Chevrolet": {
      "models": {
        "Agile": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Astra": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Aveo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Blazer": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Captiva": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Celta": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Classic": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Corsa": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Cruze": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Meriva": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Montana": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Onix": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Prisma": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "S-10": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Sonic": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Spin": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Tracker": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Trailblazer": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Vectra": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Zafira": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Citroën": {
      "models": {
        "Berlingo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "C3": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "C3 Aircross": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "C4": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "C4 Cactus": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "C-Elysée": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Xsara": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Dodge": {
      "models": {
        "Journey": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 2.5, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Fiat": {
      "models": {
        "500": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Argo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Cronos": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Ducato": { "parts": { "amortiguadores delanteros": 2.0, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.75, "bujes parrilla": 1.0, "parrilla": 1.75, "rodamiento rueda": 2.5, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.5, "rotula superior": 2.5, "esparrago de rueda": 1.0, "soporte motor": 2.5, "Homocinetica": 2.5 } },
        "Fiorino": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Idea": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Linea": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Mobi": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Palio": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Punto": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Siena": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Stilo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Strada": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Toro": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Uno": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Ford": {
      "models": {
        "EcoSport": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Fiesta": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Focus": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Ka": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Kuga": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Mondeo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Ranger": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Honda": {
      "models": {
        "Accord": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "City": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Civic": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "CR-V": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Fit": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "HR-V": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Hyundai": {
      "models": {
        "Elantra": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "i10": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "i30": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Creta": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Santa Fe": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Tucson": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Jeep": {
      "models": {
        "Cherokee": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Compass": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Grand Cherokee": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Renegade": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Wrangler": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Kia": {
      "models": {
        "Cerato": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Picanto": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Rio": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Sorento": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Soul": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Sportage": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Mercedes-Benz": {
      "models": {
        "Clase A": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Clase B": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Clase C": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "GLA": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Sprinter": { "parts": { "amortiguadores delanteros": 2.0, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.75, "bujes parrilla": 1.0, "parrilla": 1.75, "rodamiento rueda": 2.5, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.5, "rotula superior": 2.5, "esparrago de rueda": 1.0, "soporte motor": 2.5, "Homocinetica": 2.5 } },
        "Vito": { "parts": { "amortiguadores delanteros": 2.0, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.75, "bujes parrilla": 1.0, "parrilla": 1.75, "rodamiento rueda": 2.5, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.5, "rotula superior": 2.5, "esparrago de rueda": 1.0, "soporte motor": 2.5, "Homocinetica": 2.5 } },
        "X-Class": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Mitsubishi": {
      "models": {
        "L200": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Nissan": {
      "models": {
        "Frontier": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Kicks": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "March": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Note": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Sentra": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Tiida": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Versa": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Peugeot": {
      "models": {
        "2008": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "206": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "207 Compact": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "208": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "3008": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "307": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "308": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "408": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "5008": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Partner": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Ram": {
      "models": {
        "1500": { "parts": { "amortiguadores delanteros": 2.0, "amortiguadores traseros": 1.25, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.75, "bujes parrilla": 1.0, "parrilla": 1.75, "rodamiento rueda": 2.5, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.5, "rotula superior": 2.5, "esparrago de rueda": 1.0, "soporte motor": 2.5, "Homocinetica": 2.5 } }
      }
    },
    "Renault": {
      "models": {
        "Alaskan": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Captur": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Clio": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Duster": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Fluence": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Kangoo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Koleos": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Kwid": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Logan": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Master": { "parts": { "amortiguadores delanteros": 2.0, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.75, "bujes parrilla": 1.0, "parrilla": 1.75, "rodamiento rueda": 2.5, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.5, "rotula superior": 2.5, "esparrago de rueda": 1.0, "soporte motor": 2.5, "Homocinetica": 2.5 } },
        "Mégane": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Oroch": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Sandero": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Scénic": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Symbol": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Toyota": {
      "models": {
        "Camry": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Corolla": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Corolla Cross": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Etios": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Hilux": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Prius": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "RAV4": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "SW4": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Yaris": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Volkswagen": {
      "models": {
        "Amarok": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Bora": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Fox": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Gol": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Gol Trend": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Golf": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Nivus": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Passat": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Polo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Suran": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Saveiro": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Taos": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "T-Cross": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Tiguan": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Up!": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Virtus": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Voyage": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Vento": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    }
  },
  "globalParts": {
    "amortiguadores delanteros": 1.25,
    "amortiguadores traseros": 0.75,
    "axiales": 1.0,
    "bieleta": 0.7,
    "bujes barra estabilizadora": 0.5,
    "bujes parrilla": 0.75,
    "parrilla": 1.25,
    "rodamiento rueda": 1.5,
    "pastillas EJE": 1.0,
    "discos y pastillas EJE": 1.5,
    "extremo": 1.0,
    "rotula inferior": 1.5,
    "rotula superior": 2.0,
    "soporte motor": 1.5,
    "Homocinetica": 1.5,
    "esparrago de rueda": 1.0
  }
};

interface SelectedPart {
  id: string;
  name: string;
  baseTime: number;
  quantity: number; // For normal parts: 1, 2, 3... For sided parts: 1 (single) or 2 (pair)
  side?: 'left' | 'right' | 'both'; // Specific side selection
}

type PartType = 'sided' | 'non-sided' | 'axle';

export const LaborTime: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);
  const [synergyDiscount, setSynergyDiscount] = useState<number>(0);
  const [partSearchTerm, setPartSearchTerm] = useState<string>('');

  // 1. Get available models based on brand
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    // @ts-ignore
    return Object.keys(CATALOG.brands[selectedBrand]?.models || {});
  }, [selectedBrand]);

  // 2. Get available parts (Global + Model Specific)
  const availablePartsList = useMemo(() => {
    const globalKeys = Object.keys(CATALOG.globalParts);
    let modelKeys: string[] = [];

    if (selectedBrand && selectedModel) {
      // @ts-ignore
      const modelData = CATALOG.brands[selectedBrand]?.models[selectedModel];
      if (modelData?.parts) {
        modelKeys = Object.keys(modelData.parts);
      }
    }

    // Merge unique keys and Sort Alphabetically
    const allKeys = Array.from(new Set([...globalKeys, ...modelKeys]));
    return allKeys.sort((a, b) => a.localeCompare(b));
  }, [selectedBrand, selectedModel]);

  const filteredParts = useMemo(() => {
    return availablePartsList.filter(part => 
      part.toLowerCase().includes(partSearchTerm.toLowerCase())
    );
  }, [availablePartsList, partSearchTerm]);

  // Helper to determine part type
  const getPartType = (partName: string): PartType => {
    const lowerName = partName.toLowerCase();
    
    // Axle specific (sets)
    if (lowerName.includes('eje') && (lowerName.includes('pastillas') || lowerName.includes('discos'))) {
      return 'axle';
    }

    // Non-sided specific list
    if (
      lowerName.includes('buje') || 
      lowerName.includes('soporte motor') || 
      lowerName.includes('esparrago') || 
      lowerName.includes('rodamiento')
    ) {
      return 'non-sided';
    }

    // Default to sided (amortiguadores, extremos, etc)
    return 'sided';
  };

  // Helper to get time for a specific part
  const getPartTime = (partName: string): number => {
    let time = 0;
    if (selectedBrand && selectedModel) {
      // @ts-ignore
      time = CATALOG.brands[selectedBrand]?.models[selectedModel]?.parts?.[partName];
    }
    if (!time) {
      // @ts-ignore
      time = CATALOG.globalParts[partName];
    }
    return time || 0;
  };

  const handleAddPart = (partName: string) => {
    const type = getPartType(partName);
    
    const newPart: SelectedPart = {
      id: Date.now().toString(),
      name: partName,
      baseTime: getPartTime(partName),
      quantity: 1, // Default quantity
      side: type === 'sided' ? 'left' : undefined // Default to left for sided parts
    };
    setSelectedParts([...selectedParts, newPart]);
  };

  const handleRemovePart = (id: string) => {
    setSelectedParts(selectedParts.filter(p => p.id !== id));
  };

  const updateSide = (id: string, newSide: 'left' | 'right' | 'both') => {
    setSelectedParts(selectedParts.map(p => {
      if (p.id === id) {
        // If selecting both, quantity is 2. If L/R, quantity is 1.
        const newQty = newSide === 'both' ? 2 : 1;
        return { ...p, side: newSide, quantity: newQty };
      }
      return p;
    }));
  };
  
  const updateQuantity = (id: string, qty: number, partType: PartType) => {
      if (qty < 1) return;
      if (qty > 4) qty = 4;

      setSelectedParts(selectedParts.map(p => {
        if (p.id === id) {
          // Logic for Sided Parts auto-toggle
          let newSide = p.side;
          if (partType === 'sided') {
             if (qty === 2) newSide = 'both';
             else if (qty === 1 && newSide === 'both') newSide = 'left'; // Default back to left if reducing from both
          }
          return { ...p, quantity: qty, side: newSide };
        }
        return p;
      }));
  };

  const handleReset = () => {
    setSelectedParts([]);
    setSynergyDiscount(0);
    setSelectedBrand('');
    setSelectedModel('');
    setPartSearchTerm('');
  };

  // Calculations
  const rawTotalTime = selectedParts.reduce((acc, part) => acc + (part.baseTime * part.quantity), 0);
  const discountAmount = rawTotalTime * (synergyDiscount / 100);
  const finalTotalTime = rawTotalTime - discountAmount;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg border-t-4 border-t-gray-600 animate-fade-in flex flex-col h-full">
      <div className="p-6 md:p-8 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 text-gray-700">
              <Timer className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Calculadora de Tiempos</h3>
              <p className="text-sm text-gray-500">Estimación de mano de obra según estándares de fábrica.</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
            title="Reiniciar todo"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: SELECTORS */}
          <div className="lg:col-span-1 space-y-6">
            {/* Vehicle Selection - FIXED WHITE BACKGROUND */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                <Car className="w-4 h-4 mr-2" /> Vehículo
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Marca</label>
                  <select 
                    className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm py-2 px-3 text-gray-900 font-medium"
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setSelectedModel('');
                      setSelectedParts([]); 
                    }}
                  >
                    <option value="">Seleccionar Marca...</option>
                    {Object.keys(CATALOG.brands).sort().map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Modelo</label>
                  <select 
                    className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm py-2 px-3 text-gray-900 font-medium disabled:bg-gray-50 disabled:text-gray-400"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedBrand}
                  >
                    <option value="">Seleccionar Modelo...</option>
                    {availableModels.sort().map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Parts Picker */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[450px] shadow-sm">
               <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                 <h4 className="font-bold text-gray-800 text-sm mb-2">Catálogo de Piezas</h4>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Search className="h-3 w-3 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={partSearchTerm}
                      onChange={(e) => setPartSearchTerm(e.target.value)}
                      className="block w-full pl-8 pr-2 py-1.5 text-xs border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Buscar repuesto..."
                    />
                 </div>
               </div>
               <div className="overflow-y-auto p-1 flex-grow scrollbar-thin scrollbar-thumb-gray-300">
                 {selectedBrand && selectedModel ? (
                    filteredParts.length > 0 ? (
                      <div className="space-y-1">
                        {filteredParts.map(part => (
                          <button
                            key={part}
                            onClick={() => handleAddPart(part)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 rounded flex justify-between items-center group transition-colors border border-transparent hover:border-brand-100"
                          >
                            <span className="capitalize truncate mr-2">{part}</span>
                            <Plus className="w-4 h-4 text-gray-300 group-hover:text-brand-500 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-400 italic">
                        No se encontraron piezas con ese nombre.
                      </div>
                    )
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                     <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                     <p className="text-xs">Seleccione un vehículo para ver las piezas disponibles.</p>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ESTIMATION */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col flex-grow overflow-hidden">
              <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <h4 className="font-bold flex items-center">
                   <Clock className="w-5 h-5 mr-2 text-gold-400" />
                   Estimación de Trabajo
                </h4>
                {selectedModel && (
                  <span className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-200 font-medium border border-gray-600">
                    {selectedBrand} {selectedModel}
                  </span>
                )}
              </div>

              {/* Items List */}
              <div className="flex-grow p-0 overflow-y-auto min-h-[300px]">
                {selectedParts.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3 text-left w-1/3">Pieza</th>
                        <th className="px-4 py-3 text-center w-1/6">Cant.</th>
                        <th className="px-4 py-3 text-center w-1/3">Configuración</th>
                        <th className="px-4 py-3 text-right w-1/6">Tiempo</th>
                        <th className="px-4 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedParts.map((item) => {
                         const partType = getPartType(item.name);
                         
                         return (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-800 font-medium capitalize align-middle">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-center align-middle">
                               <input 
                                 type="number" 
                                 min="1" 
                                 max="4"
                                 value={item.quantity}
                                 onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), partType)}
                                 className="w-12 text-center border border-gray-300 rounded text-sm font-bold py-1 focus:ring-brand-500 focus:border-brand-500"
                               />
                            </td>
                            <td className="px-4 py-3 text-center align-middle">
                               {partType === 'sided' ? (
                                 <div className="inline-flex bg-gray-100 rounded-md p-0.5 shadow-inner">
                                   <button 
                                     onClick={() => updateSide(item.id, 'left')}
                                     className={`w-8 py-1 text-xs font-bold rounded transition-all ${item.side === 'left' ? 'bg-white text-brand-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                                     title="Izquierda"
                                   >
                                     Izq
                                   </button>
                                   <button 
                                     onClick={() => updateSide(item.id, 'right')}
                                     className={`w-8 py-1 text-xs font-bold rounded transition-all ${item.side === 'right' ? 'bg-white text-brand-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                                     title="Derecha"
                                   >
                                     Der
                                   </button>
                                   <button 
                                      onClick={() => updateSide(item.id, 'both')}
                                      className={`px-3 py-1 text-xs font-bold rounded transition-all ${item.side === 'both' ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                   >
                                     Ambos
                                   </button>
                                 </div>
                               ) : partType === 'axle' ? (
                                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                   Juego Eje
                                 </span>
                               ) : (
                                 <span className="text-xs text-gray-400 italic">
                                   Sin lado
                                 </span>
                               )}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 font-mono align-middle">
                              {(item.baseTime * item.quantity).toFixed(2)} h
                            </td>
                            <td className="px-4 py-3 text-right align-middle">
                              <button 
                                onClick={() => handleRemovePart(item.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                         );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                     <Clock className="w-16 h-16 mb-4" />
                     <p>No hay trabajos seleccionados</p>
                  </div>
                )}
              </div>

              {/* Footer Summary */}
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                 
                 {/* Synergy Adjuster */}
                 <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mr-2">Ajuste por Sinergia</label>
                          <div className="group relative">
                             <AlertCircle className="w-3 h-3 text-gray-400 cursor-help" />
                             <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded p-2 hidden group-hover:block z-10">
                               Aplica este descuento si los trabajos comparten procesos de desarmado.
                             </div>
                          </div>
                       </div>
                       <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                         -{synergyDiscount}%
                       </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      step="5"
                      value={synergyDiscount} 
                      onChange={(e) => setSynergyDiscount(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    />
                 </div>

                 <div className="flex items-end justify-between border-t border-gray-200 pt-4">
                    <div className="text-right flex-1">
                       <p className="text-xs text-gray-500 mb-1">Subtotal: {rawTotalTime.toFixed(2)} h</p>
                       {discountAmount > 0 && (
                         <p className="text-xs text-green-600 mb-1 font-medium">Ahorro: -{discountAmount.toFixed(2)} h</p>
                       )}
                       <div className="flex items-center justify-end text-3xl font-extrabold text-gray-900 leading-none mt-2">
                         {finalTotalTime.toFixed(2)} <span className="text-base font-medium text-gray-500 ml-1 self-end mb-1">horas</span>
                       </div>
                    </div>
                 </div>

                 <div className="mt-4">
                    <button className="w-full bg-gray-900 text-gold-400 font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors flex justify-center items-center shadow-md">
                       <Save className="w-5 h-5 mr-2" />
                       Guardar Presupuesto
                    </button>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
