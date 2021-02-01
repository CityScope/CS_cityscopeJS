import numpy as np
import random

from typing import List, Any


def random_heatmap(geogrid: np.ndarray):
    return {
        'name': 'Ecological Impact',
        'heatmap': [
            {'value': 0.33, 'height': random.randint(1, 10)},
            {'value': 0.75, 'height': random.randint(1, 10)}
        ]
    }


class CumsumHeatpmap():
    base_val: float = 0
    hist: List[Any] = []

    def __call__(self, types: List[Any]):
        temp = random.random()
        self.base_val += temp
        self.hist.append({'id': len(types), 'value': self.base_val})

        return {
            'name': 'Economical Impact',
            'heatmap': self.hist
        }
