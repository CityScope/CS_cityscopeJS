from typing import NamedTuple, Union, List, Dict, Any, Callable
import json
from time import sleep

from enum import Enum

JSON = Union[Dict[str, Any], List[Any], str, int, float, bool]
Simulator = Callable[[Any], JSON]


class Module(NamedTuple):
    name: str = 'Sample'
    in_field: str = 'Types'
    func: Simulator = lambda x: x


class State(Enum):
    Running = 0
    Done = 1
    Cancelled = 2
    Terminated = 3
    Error = 4


class Simulator():
    def __init__(self):
        self.sims = {}
        self.jobs = {}
        self.log = []

    def setup(self, sims: List[Module]) -> Any:
        self.sims = {s.name: s for s in sims}
        return self.sims.keys()

    def run(self, names: List[str], db, table, fps=10, duration=200) -> None:
        for i in names:
            assert i in self.sims.keys(), 'Module Not Found'

        for i in names:
            self.jobs[i] = State.Running

        sim = Module()
        sim_list = names
        print(f'Start Running > {sim_list}')
        try:
            for _ in range(duration):
                for n in sim_list:
                    sim = self.sims[n]
                    data = db(1).hget(table, sim.in_field.capitalize())
                    ret = sim.func(json.loads(data))
                    db(1).hset(table, f'Mod:{sim.name}', json.dumps(ret))
                    if self.jobs[n] == State.Cancelled:
                        sim_list.remove(n)
                        print(f'Cancelled: {n} > Left: {sim_list}')
                        if len(sim_list) == 0:
                            return
                        break

                sleep(1 / fps)

        except Exception as e:
            print(f'Unexpected Error occured: {e.args}')
            self.jobs[sim.name] = State.Error
            self.log.append({sim.name: {"state": State.Error, "msg": e.args}})
        finally:
            print(f'Done > {sim_list}')
            self.jobs[sim.name] = State.Done

    def stop(self, names: List[str]) -> bool:
        print(f'Recieve termination signal > {names}')
        for i in names:
            if i not in self.jobs.keys() or self.jobs[i] != State.Running:
                return False
        for i in names:
            self.jobs[i] = State.Cancelled
        return True

    def get_jobs(self):
        return {'state': {k: v.name for k, v in self.jobs.items()}, 'log': self.log}
