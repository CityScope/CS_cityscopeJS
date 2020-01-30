# CityScopeJS Architecture

CityScopeJS is a modular, open-ended architecture for MIT CityScope project.

![CityScopeJS Architecture](figures/CityScopeJS_arch.png)

CityScopeJS includes several modules for building, testing and deploying an end-to-end CityScope platform. Each module is developed as a standalone part of the system with minimal dependency on others. Data flow between modules is achieved using [cityIO](https://cityio.media.mit.edu), which operates between the different modules.
