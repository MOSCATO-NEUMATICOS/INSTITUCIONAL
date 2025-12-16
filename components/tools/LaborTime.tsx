
import React, { useState, useMemo, useEffect } from 'react';
import { Timer, Car, Plus, Trash2, Clock, AlertCircle, Search, HelpCircle, X, CheckCircle2, Percent, DollarSign, Calculator } from 'lucide-react';

// --- DATA CATALOG (Updated) ---
const CATALOG = {
  "brands": {
    "Audi": {
      "models": {
        "A3": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "A4": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Q5": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "BMW": {
      "models": {
        "Serie 1": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Serie 3": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "X1": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "X3": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Chery": {
      "models": {
        "Fulwin": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "QQ": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Tiggo": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Chevrolet": {
      "models": {
        "Agile": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Astra": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Aveo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Blazer": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Captiva": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Celta": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Classic": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Corsa": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Cruze": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Meriva": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Montana": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Onix": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Prisma": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "S-10": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Sonic": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Spin": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Tracker": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Trailblazer": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Vectra": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Zafira": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Citroën": {
      "models": {
        "Berlingo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "C3": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "C3 Aircross": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "C4": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "C4 Cactus": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "C-Elysée": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Xsara": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Dodge": {
      "models": {
        "Journey": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 2.5, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Fiat": {
      "models": {
        "500": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Argo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Cronos": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Ducato": { "parts": { "amortiguadores delanteros": 2.0, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.75, "bujes parrilla": 1.0, "parrilla": 1.75, "rodamiento rueda delantera": 2.5, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.5, "rotula superior": 2.5, "esparrago de rueda": 1.0, "soporte motor": 2.5, "Homocinetica": 2.5 } },
        "Fiorino": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Idea": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Linea": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Mobi": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Palio": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Punto": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Siena": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Stilo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Strada": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Toro": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Uno": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Ford": {
      "models": {
        "EcoSport": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Fiesta": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Focus": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Ka": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Kuga": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Mondeo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Ranger": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Honda": {
      "models": {
        "Accord": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "City": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Civic": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "CR-V": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Fit": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "HR-V": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Hyundai": {
      "models": {
        "Elantra": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "i10": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "i30": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Creta": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Santa Fe": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Tucson": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Jeep": {
      "models": {
        "Cherokee": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Compass": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Grand Cherokee": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Renegade": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Wrangler": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Kia": {
      "models": {
        "Cerato": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Picanto": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Rio": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Sorento": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Soul": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Sportage": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Mercedes-Benz": {
      "models": {
        "Clase A": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Clase B": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Clase C": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "GLA": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Sprinter": { "parts": { "amortiguadores delanteros": 2.0, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.75, "bujes parrilla": 1.0, "parrilla": 1.75, "rodamiento rueda delantera": 2.5, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.5, "rotula superior": 2.5, "esparrago de rueda": 1.0, "soporte motor": 2.5, "Homocinetica": 2.5 } },
        "Vito": { "parts": { "amortiguadores delanteros": 2.0, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.75, "bujes parrilla": 1.0, "parrilla": 1.75, "rodamiento rueda delantera": 2.5, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.5, "rotula superior": 2.5, "esparrago de rueda": 1.0, "soporte motor": 2.5, "Homocinetica": 2.5 } },
        "X-Class": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Mitsubishi": {
      "models": {
        "L200": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } }
      }
    },
    "Nissan": {
      "models": {
        "Frontier": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Kicks": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "March": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Note": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Sentra": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Tiida": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Versa": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Peugeot": {
      "models": {
        "2008": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "206": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "207 Compact": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "208": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "3008": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "307": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "308": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "408": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "5008": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Partner": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Ram": {
      "models": {
        "1500": { "parts": { "amortiguadores delanteros": 2.0, "amortiguadores traseros": 1.25, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.75, "bujes parrilla": 1.0, "parrilla": 1.75, "rodamiento rueda delantera": 2.5, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.5, "rotula superior": 2.5, "esparrago de rueda": 1.0, "soporte motor": 2.5, "Homocinetica": 2.5 } }
      }
    },
    "Renault": {
      "models": {
        "Alaskan": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Captur": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Clio": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Duster": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Fluence": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Kangoo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Koleos": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Kwid": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Logan": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Master": { "parts": { "amortiguadores delanteros": 2.0, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.75, "bujes parrilla": 1.0, "parrilla": 1.75, "rodamiento rueda delantera": 2.5, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.5, "rotula superior": 2.5, "esparrago de rueda": 1.0, "soporte motor": 2.5, "Homocinetica": 2.5 } },
        "Mégane": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Oroch": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Sandero": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Scénic": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Symbol": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Toyota": {
      "models": {
        "Camry": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Corolla": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Corolla Cross": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Etios": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Hilux": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Prius": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "RAV4": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "SW4": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Yaris": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } }
      }
    },
    "Volkswagen": {
      "models": {
        "Amarok": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Bora": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Fox": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Gol": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Gol Trend": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Golf": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Nivus": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Passat": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Polo": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Suran": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Saveiro": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Taos": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "T-Cross": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "rotula superior": 1.5, "esparrago de rueda": 1.0, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Tiguan": { "parts": { "amortiguadores delanteros": 1.75, "amortiguadores traseros": 1.0, "axiales": 1.5, "bieleta": 1.0, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.88, "parrilla": 1.5, "rodamiento rueda delantera": 2.0, "pastillas EJE": 1.5, "discos y pastillas EJE": 2.0, "extremo": 1.0, "rotula inferior": 2.0, "rotula superior": 2.0, "esparrago de rueda": 1.0, "soporte motor": 2.0, "Homocinetica": 2.0 } },
        "Up!": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Virtus": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Voyage": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } },
        "Vento": { "parts": { "amortiguadores delanteros": 1.25, "amortiguadores traseros": 0.75, "axiales": 1.0, "bieleta": 0.7, "bujes barra estabilizadora": 0.5, "bujes parrilla": 0.75, "parrilla": 1.25, "rodamiento rueda delantera": 1.5, "pastillas EJE": 1.0, "discos y pastillas EJE": 1.5, "extremo": 1.0, "rotula inferior": 1.5, "soporte motor": 1.5, "Homocinetica": 1.5 } }
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
    "rodamiento rueda delantera": 1.5,
    "rodamiento rueda trasera": 1.0,
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

// Parts strictly limited to max 2 units
const LIMITED_PARTS_MAX_2 = [
  "amortiguadores delanteros", "amortiguadores traseros", "axiales",
  "discos y pastillas", "homocinetica", "pastillas",
  "rodamiento", "rotula", "extremo"
];

interface SelectedPart {
  id: string;
  name: string;
  baseTime: number;
  quantity: number; // For normal parts: 1, 2, 3... For sided parts: 1 (single) or 2 (pair)
  side?: 'left' | 'right' | 'both'; // Specific side selection
}

type PartType = 'sided' | 'non-sided' | 'axle';

interface SynergyResult {
  type: 'free' | 'half' | 'none';
  label?: string;
}

export const LaborTime: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);
  const [synergyDiscount, setSynergyDiscount] = useState<number>(0);
  const [partSearchTerm, setPartSearchTerm] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [showHelp, setShowHelp] = useState(false);

  // Auto-calculate general synergy discount based on number of jobs
  useEffect(() => {
    const count = selectedParts.length;
    let newDiscount = 0;
    
    if (count > 1) {
      // 5% discount for each additional job beyond the first one, capped at 20%
      // 2 items = 5%, 3 items = 10%, 4 items = 15%, 5+ items = 20%
      newDiscount = Math.min((count - 1) * 5, 20);
    }
    
    setSynergyDiscount(newDiscount);
  }, [selectedParts]);

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
      lowerName.includes('soporte motor') || 
      lowerName.includes('esparrago')
    ) {
      return 'non-sided';
    }

    // Default to sided (amortiguadores, extremos, rotulas, bujes parrilla, etc)
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
    // Check for duplicates
    if (selectedParts.some(p => p.name === partName)) {
      alert(`El repuesto "${partName}" ya se encuentra en la lista. Por favor modifique la cantidad o los lados del item existente.`);
      return;
    }

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
        // If selecting both, quantity is 2 (normally). 
        // NOTE: If part is "bujes parrilla", selecting both *could* imply 4 if user wants, handled in quantity update.
        // For standard behavior on toggle, reset to 2 if coming from L/R.
        // If already 4 (bujes), keep 4.
        let newQty = 1;
        if (newSide === 'both') {
           newQty = p.quantity >= 2 ? p.quantity : 2; 
        } else {
           newQty = 1; // Single side is always 1
        }
        return { ...p, side: newSide, quantity: newQty };
      }
      return p;
    }));
  };
  
  const updateQuantity = (id: string, qty: number, partType: PartType, partName: string) => {
      const lowerName = partName.toLowerCase();
      let maxQty = 4;

      // Rule: Strictly limited parts capped at 2
      if (LIMITED_PARTS_MAX_2.some(k => lowerName.includes(k))) {
        maxQty = 2;
      }

      // Rule: Bujes allow 4
      if (lowerName.includes('bujes')) {
        maxQty = 4;
      }

      if (qty < 1) qty = 1;
      if (qty > maxQty) qty = maxQty;

      setSelectedParts(selectedParts.map(p => {
        if (p.id === id) {
          // Logic for Sided Parts auto-toggle
          let newSide = p.side;
          if (partType === 'sided') {
             if (qty >= 2) newSide = 'both';
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
    setHourlyRate(0);
  };

  // --- SMART SYNERGY CALCULATOR ---
  const calculateSmartTotal = () => {
    // 1. Identify active Major Operations per side
    const context = {
      left: { 
        hasAxial: false, 
        hasFrontShock: false, 
        hasBallJoint: false,
        hasControlArm: false,
        hasFrontBearing: false
      },
      right: { 
        hasAxial: false, 
        hasFrontShock: false, 
        hasBallJoint: false,
        hasControlArm: false,
        hasFrontBearing: false
      }
    };

    // First Pass: Populate Context
    selectedParts.forEach(p => {
      const name = p.name.toLowerCase();
      
      const checkSide = (side: 'left' | 'right') => {
        if (p.side === side || p.side === 'both') {
          if (name.includes('axial')) context[side].hasAxial = true;
          if (name.includes('amortiguadores delanteros')) context[side].hasFrontShock = true;
          if (name.includes('rotula')) context[side].hasBallJoint = true;
          // Exclude bushings from being considered a control arm replacement
          if (name.includes('parrilla') && !name.includes('bujes')) context[side].hasControlArm = true;
          if (name.includes('rodamiento rueda delantera')) context[side].hasFrontBearing = true;
        }
      };

      checkSide('left');
      checkSide('right');
    });

    let total = 0;

    // Second Pass: Calculate Cost based on Synergy Rules
    selectedParts.forEach(p => {
      const name = p.name.toLowerCase();
      let partTime = 0;

      // Helper to calculate time for one side
      const calcSideTime = (side: 'left' | 'right') => {
        let time = p.baseTime;
        const ctx = context[side];

        // Rule 1: Extremo free if Axial OR Front Shock present
        if (name.includes('extremo')) {
          if (ctx.hasAxial || ctx.hasFrontShock) time = 0;
        }
        
        // Rule 2: Bujes Parrilla free if Rotula present
        // (Assuming swapping Rotula involves removing arm or easy access to bushings)
        else if (name.includes('bujes parrilla')) {
          if (ctx.hasBallJoint) time = 0;
        }

        // Rule 3: Rotula free if Parrilla present
        else if (name.includes('rotula')) {
          if (ctx.hasControlArm) time = 0;
        }

        // Rule 4: Homocinetica 50% off if Front Shock OR Front Bearing present
        else if (name.includes('homocinetica')) {
          if (ctx.hasFrontShock || ctx.hasFrontBearing) time = time * 0.5;
        }

        // Rule 5: Bieleta 50% off if Front Shock present
        else if (name.includes('bieleta')) {
          if (ctx.hasFrontShock) time = time * 0.5;
        }

        return time;
      };

      if (p.side === 'both') {
        // Special logic for high quantities (e.g. 4 bujes -> 2 per side)
        // If quantity is > 2, we assume even distribution.
        const qtyPerSide = p.quantity >= 2 ? p.quantity / 2 : 1; 
        
        // Multiplying base time result by quantity per side (e.g. 0.5hr * 2 bujes = 1hr left side)
        partTime += calcSideTime('left') * qtyPerSide;
        partTime += calcSideTime('right') * qtyPerSide;
      } else if (p.side === 'left') {
        partTime += calcSideTime('left') * p.quantity;
      } else if (p.side === 'right') {
        partTime += calcSideTime('right') * p.quantity;
      } else {
        // Non-sided parts
        partTime = p.baseTime * p.quantity;
      }
      
      total += partTime;
    });

    return total;
  };

  // Helper to determine the synergy status for UI display
  const getSynergyStatus = (p: SelectedPart): SynergyResult => {
    const name = p.name.toLowerCase();
    
    // We need to re-scan for context to display the tag correctly
    // This is a simplified check for UI purposes
    const hasContext = (predicate: (name: string) => boolean) => {
      return selectedParts.some(other => {
        if (other.id === p.id) return false; // Don't check self
        const sideMatch = (other.side === 'both' || p.side === 'both' || other.side === p.side);
        return sideMatch && predicate(other.name.toLowerCase());
      });
    };

    if (name.includes('extremo')) {
      if (hasContext(n => n.includes('axial') || n.includes('amortiguadores delanteros'))) {
        return { type: 'free', label: 'Incluido por desarme' };
      }
    }
    
    if (name.includes('bujes parrilla')) {
      if (hasContext(n => n.includes('rotula'))) {
        return { type: 'free', label: 'Incluido c/ Rótula' };
      }
    }

    if (name.includes('rotula')) {
      // Exclude bushings from triggering this
      if (hasContext(n => n.includes('parrilla') && !n.includes('bujes'))) {
        return { type: 'free', label: 'Incluido en Parrilla' };
      }
    }

    if (name.includes('homocinetica')) {
      if (hasContext(n => n.includes('amortiguadores delanteros') || n.includes('rodamiento rueda delantera'))) {
        return { type: 'half', label: 'Sinergia 50%' };
      }
    }

    if (name.includes('bieleta')) {
      if (hasContext(n => n.includes('amortiguadores delanteros'))) {
        return { type: 'half', label: 'Sinergia 50%' };
      }
    }

    return { type: 'none' };
  };

  const rawTotalTime = calculateSmartTotal();
  const discountAmount = rawTotalTime * (synergyDiscount / 100);
  const finalTotalTime = rawTotalTime - discountAmount;
  const totalPrice = finalTotalTime * hourlyRate;

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg border-t-4 border-t-gray-600 animate-fade-in flex flex-col h-full transition-colors">
      <div className="p-6 md:p-8 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4 text-gray-700 dark:text-gray-300">
              <Timer className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Calculadora de Tiempos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Estimación de mano de obra según estándares de fábrica.</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center text-sm font-semibold text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 transition-colors bg-brand-50 dark:bg-brand-900/30 px-3 py-2 rounded-md border border-brand-100 dark:border-brand-800 hover:border-brand-200"
              title="Ayuda / Instrucciones"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ayuda</span>
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center text-sm font-semibold text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Reiniciar todo"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          </div>
        </div>

        {/* --- HELP SECTION --- */}
        {showHelp && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-fade-in relative">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              ¿Cómo funciona la Sinergia Inteligente?
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-200 mb-2">
              El sistema detecta automáticamente cuando se realizan trabajos superpuestos en el mismo lado del vehículo y descuenta el tiempo duplicado.
            </p>
            <ul className="text-xs text-blue-600 dark:text-blue-300 list-disc list-inside space-y-1 ml-1">
              <li><strong>Ejemplo 1:</strong> Si cambias <em>Amortiguadores</em>, el cambio de <em>Bieletas</em> se cobra al 50% (ya que están accesibles).</li>
              <li><strong>Ejemplo 2:</strong> Si cambias <em>Axiales</em> o <em>Amortiguadores</em>, el cambio de <em>Extremos</em> es GRATIS (0 hs) porque es parte del mismo desarme.</li>
              <li><strong>Ejemplo 3:</strong> Si cambias la <em>Parrilla Completa</em>, la mano de obra de la <em>Rótula</em> queda bonificada.</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: SELECTORS */}
          <div className="lg:col-span-1 space-y-6">
            {/* Vehicle Selection - FIXED WHITE BACKGROUND */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
              <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <Car className="w-4 h-4 mr-2" /> Vehículo
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">Marca</label>
                  <select 
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm py-2 px-3 text-gray-900 dark:text-white font-medium"
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
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">Modelo</label>
                  <select 
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm py-2 px-3 text-gray-900 dark:text-white font-medium disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400"
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      setSelectedParts([]); // Reset parts when model changes
                    }}
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
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col h-[450px] shadow-sm transition-colors">
               <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                 <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-2">Catálogo de Piezas</h4>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <Search className="h-3 w-3 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={partSearchTerm}
                      onChange={(e) => setPartSearchTerm(e.target.value)}
                      className="block w-full pl-8 pr-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Buscar repuesto..."
                    />
                 </div>
               </div>
               <div className="overflow-y-auto p-1 flex-grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                 {selectedBrand && selectedModel ? (
                    filteredParts.length > 0 ? (
                      <div className="space-y-1">
                        {filteredParts.map(part => (
                          <button
                            key={part}
                            onClick={() => handleAddPart(part)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300 rounded flex justify-between items-center group transition-colors border border-transparent hover:border-brand-100 dark:hover:border-brand-800"
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
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col flex-grow overflow-hidden transition-colors">
              <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <h4 className="font-bold flex items-center">
                   <Clock className="w-5 h-5 mr-2 text-gold-400" />
                   Estimación de Trabajo
                </h4>
                {selectedModel && (
                  <span className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-200 font-medium border border-gray-600 hidden sm:inline-block">
                    {selectedBrand} {selectedModel}
                  </span>
                )}
              </div>

              {/* Items List - Responsive */}
              <div className="flex-grow p-0 overflow-y-auto min-h-[300px]">
                {selectedParts.length > 0 ? (
                  <>
                    {/* Desktop View (Table) */}
                    <div className="hidden md:block">
                      <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                          <tr>
                            <th className="px-4 py-3 text-left w-1/3">Pieza</th>
                            <th className="px-4 py-3 text-center w-1/6">Cant.</th>
                            <th className="px-4 py-3 text-center w-1/3">Configuración</th>
                            <th className="px-4 py-3 text-right w-1/6">Tiempo</th>
                            <th className="px-4 py-3 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {selectedParts.map((item) => {
                             const partType = getPartType(item.name);
                             const synergy = getSynergyStatus(item);
                             
                             // Calculate display time based on smart total logic per line
                             let calculatedLineTime = 0;
                             if (item.side === 'both') {
                                // Assume even split: half quantity left, half right.
                                const qtyPerSide = item.quantity >= 2 ? item.quantity / 2 : 1;
                                calculatedLineTime = (item.baseTime * qtyPerSide) * 2; // Simple base calc
                             } else {
                                calculatedLineTime = item.baseTime * item.quantity;
                             }

                             let displayTime = calculatedLineTime.toFixed(2) + ' h';
                             let timeClass = "font-bold text-gray-900 dark:text-white";
                             
                             if (synergy.type === 'free') {
                               displayTime = "0.00 h";
                               timeClass = "font-bold text-green-600 dark:text-green-400";
                             } else if (synergy.type === 'half') {
                               // Apply 50% discount to calculated line time
                               displayTime = (calculatedLineTime * 0.5).toFixed(2) + ' h';
                               timeClass = "font-bold text-blue-600 dark:text-blue-400";
                             }

                             return (
                              <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${synergy.type === 'free' ? 'bg-green-50/30 dark:bg-green-900/10' : synergy.type === 'half' ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 font-medium capitalize align-middle">
                                  {item.name}
                                  {synergy.type !== 'none' && (
                                    <div className={`text-[10px] font-bold flex items-center mt-1 ${synergy.type === 'free' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                      {synergy.type === 'free' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Percent className="w-3 h-3 mr-1" />}
                                      {synergy.label}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center align-middle">
                                   <input 
                                     type="number" 
                                     min="1" 
                                     max="4"
                                     value={item.quantity}
                                     onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), partType, item.name)}
                                     className="w-12 text-center border border-gray-300 dark:border-gray-600 rounded text-sm font-bold py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-500 focus:border-brand-500"
                                   />
                                </td>
                                <td className="px-4 py-3 text-center align-middle">
                                   {partType === 'sided' ? (
                                     <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-md p-0.5 shadow-inner">
                                       <button 
                                         onClick={() => updateSide(item.id, 'left')}
                                         className={`w-8 py-1 text-xs font-bold rounded transition-all ${item.side === 'left' ? 'bg-white dark:bg-gray-600 text-brand-600 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                         title="Izquierda"
                                       >
                                         Izq
                                       </button>
                                       <button 
                                         onClick={() => updateSide(item.id, 'right')}
                                         className={`w-8 py-1 text-xs font-bold rounded transition-all ${item.side === 'right' ? 'bg-white dark:bg-gray-600 text-brand-600 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                         title="Derecha"
                                       >
                                         Der
                                       </button>
                                       <button 
                                          onClick={() => updateSide(item.id, 'both')}
                                          className={`px-3 py-1 text-xs font-bold rounded transition-all ${item.side === 'both' ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                       >
                                         Ambos
                                       </button>
                                     </div>
                                   ) : partType === 'axle' ? (
                                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                       Juego Eje
                                     </span>
                                   ) : (
                                     <span className="text-xs text-gray-400 italic">
                                       Sin lado
                                     </span>
                                   )}
                                </td>
                                <td className={`px-4 py-3 text-right text-sm font-mono align-middle ${timeClass}`}>
                                  {displayTime}
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
                    </div>

                    {/* Mobile View (Cards) */}
                    <div className="md:hidden space-y-3 p-3">
                      {selectedParts.map((item) => {
                         const partType = getPartType(item.name);
                         const synergy = getSynergyStatus(item);
                         
                         let calculatedLineTime = 0;
                         if (item.side === 'both') {
                            const qtyPerSide = item.quantity >= 2 ? item.quantity / 2 : 1;
                            calculatedLineTime = (item.baseTime * qtyPerSide) * 2;
                         } else {
                            calculatedLineTime = item.baseTime * item.quantity;
                         }

                         let displayTime = calculatedLineTime.toFixed(2) + ' h';
                         let timeClass = "font-bold text-gray-900 dark:text-white";
                         
                         if (synergy.type === 'free') {
                           displayTime = "0.00 h";
                           timeClass = "font-bold text-green-600 dark:text-green-400";
                         } else if (synergy.type === 'half') {
                           displayTime = (calculatedLineTime * 0.5).toFixed(2) + ' h';
                           timeClass = "font-bold text-blue-600 dark:text-blue-400";
                         }

                         return (
                          <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-4 relative ${synergy.type === 'free' ? 'border-green-200 dark:border-green-800 bg-green-50/20 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                            <button 
                              onClick={() => handleRemovePart(item.id)}
                              className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-2"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                            
                            <h5 className="font-bold text-gray-800 dark:text-gray-200 capitalize pr-8">{item.name}</h5>
                            
                            {synergy.type !== 'none' && (
                              <div className={`text-xs font-bold flex items-center mt-1 mb-2 ${synergy.type === 'free' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                {synergy.type === 'free' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Percent className="w-3 h-3 mr-1" />}
                                {synergy.label}
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              {/* Quantity & Side Controls */}
                              <div className="flex items-center gap-2">
                                <input 
                                   type="number" 
                                   min="1" 
                                   max="4"
                                   value={item.quantity}
                                   onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), partType, item.name)}
                                   className="w-12 text-center border border-gray-300 dark:border-gray-600 rounded text-sm font-bold py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-500"
                                 />
                                 
                                 {partType === 'sided' && (
                                   <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-md p-0.5">
                                     <button 
                                       onClick={() => updateSide(item.id, 'left')}
                                       className={`px-2 py-1.5 text-xs font-bold rounded ${item.side === 'left' ? 'bg-white dark:bg-gray-600 text-brand-600 dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-500'}`}
                                     >L</button>
                                     <button 
                                       onClick={() => updateSide(item.id, 'right')}
                                       className={`px-2 py-1.5 text-xs font-bold rounded ${item.side === 'right' ? 'bg-white dark:bg-gray-600 text-brand-600 dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-500'}`}
                                     >R</button>
                                     <button 
                                        onClick={() => updateSide(item.id, 'both')}
                                        className={`px-2 py-1.5 text-xs font-bold rounded ${item.side === 'both' ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-400 dark:text-gray-500'}`}
                                     >All</button>
                                   </div>
                                 )}
                              </div>

                              <div className={`text-xl font-mono ${timeClass}`}>
                                {displayTime}
                              </div>
                            </div>
                          </div>
                         );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 opacity-50 p-8">
                     <Clock className="w-16 h-16 mb-4" />
                     <p>No hay trabajos seleccionados</p>
                  </div>
                )}
              </div>

              {/* Footer Summary */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-200 dark:border-gray-700">
                 
                 {/* Synergy Adjuster */}
                 <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center">
                          <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mr-2">Ajuste Manual</label>
                          <div className="group relative">
                             <AlertCircle className="w-3 h-3 text-gray-400 cursor-help" />
                          </div>
                       </div>
                       <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800">
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
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    />
                 </div>

                 {/* Calculations and Price */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4 items-end">
                    
                    {/* Hourly Rate Input */}
                    <div>
                       <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                         Valor Hora ($)
                       </label>
                       <div className="relative rounded-md shadow-sm">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <DollarSign className="h-4 w-4 text-gray-400" />
                         </div>
                         <input
                           type="number"
                           className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-9 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md py-2 font-bold bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border"
                           placeholder="0"
                           value={hourlyRate || ''}
                           onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
                         />
                       </div>
                    </div>

                    {/* Totals */}
                    <div className="text-right">
                       <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Subtotal Tiempo: {rawTotalTime.toFixed(2)} h</p>
                       {discountAmount > 0 && (
                         <p className="text-xs text-green-600 dark:text-green-400 mb-1 font-medium">Ahorro Manual: -{discountAmount.toFixed(2)} h</p>
                       )}
                       
                       <div className="flex flex-col items-end">
                         <div className="flex items-center text-3xl font-extrabold text-gray-900 dark:text-white leading-none mt-1">
                           {finalTotalTime.toFixed(2)} <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1 self-end mb-1">horas</span>
                         </div>
                         
                         {hourlyRate > 0 && finalTotalTime > 0 && (
                           <div className="flex items-center mt-2 text-2xl font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-3 py-1 rounded-md border border-brand-100 dark:border-brand-800">
                             <Calculator className="w-4 h-4 mr-2" />
                             {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalPrice)}
                           </div>
                         )}
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
