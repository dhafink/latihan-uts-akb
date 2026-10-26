# Uji silang nilai optimal solver.js dengan scipy (linprog untuk transportasi, linear_sum_assignment untuk assignment).
# Jalankan: node uji/silang.js uji/silang.json && python -I uji/silang.py uji/silang.json
import json
import sys

import numpy as np
from scipy.optimize import linear_sum_assignment, linprog

BIG = 1e6
data = json.load(open(sys.argv[1], encoding="utf-8"))
beda = 0
for r in data:
    d = r["data"]
    if r["metode"] == "tp":
        S = [s["supply"] for s in d["sumber"]]
        D = [t["demand"] for t in d["tujuan"]]
        mx = d.get("goal") == "max"
        terl = {tuple(x) for x in d.get("terlarang", [])}
        C = np.array([[(-BIG if mx else BIG) if (x == "M" or x is None or (i, j) in terl) else x
                       for j, x in enumerate(row)] for i, row in enumerate(d["biaya"])], float)
        m, n = C.shape
        sgn = -1 if mx else 1
        A_ub, b_ub = [], []
        for i in range(m):
            A_ub.append([1 if k // n == i else 0 for k in range(m * n)]); b_ub.append(S[i])
        for j in range(n):
            A_ub.append([1 if k % n == j else 0 for k in range(m * n)]); b_ub.append(D[j])
        res = linprog(sgn * C.flatten(), A_ub=A_ub, b_ub=b_ub, A_eq=[[1] * (m * n)], b_eq=[min(sum(S), sum(D))], bounds=(0, None))
        opt = sgn * res.fun
        ok = abs(opt - r["total"]) < 1e-6 and r["m"] == 0
    else:
        V = np.array([[np.nan if (x == "M" or x is None) else x for x in row] for row in d["nilai"]], float)
        for (i, j) in d.get("terlarang", []):
            V[i, j] = np.nan
        mx = d.get("goal") == "max"
        M = np.where(np.isnan(V), -BIG if mx else BIG, V)
        rr, cc = linear_sum_assignment(M, maximize=mx)
        opt = M[rr, cc].sum()
        ok = abs(opt - r["total"]) < 1e-6
    beda += not ok
    print(("OK  " if ok else "BEDA"), r["tag"], "solver =", r["total"], "scipy =", round(float(opt), 6))
print(f"\n{len(data)} soal, {beda} beda")
sys.exit(1 if beda else 0)
