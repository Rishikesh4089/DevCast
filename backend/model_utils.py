# model_utils.py
import numpy as np
import pandas as pd

def enforce_experience_effect(X, preds):
    prog_exp = np.minimum(X['Programmers experience in programming language'], 5)
    pm_exp = np.minimum(X['Project manager experience'], 5)
    exp_factor = 1.0 - (0.04 * (prog_exp + pm_exp))
    return np.maximum(preds * exp_factor, preds * 0.6)