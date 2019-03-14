1. Open netedit from <SUMO_INSTALL_DIRECTORY>/bin and select File-->New Network. Refer: "http://sumo.dlr.de/wiki/NETEDIT#Edit_Modes" for additional info

2. Enable the check boxes "chain" and "two-way"

3. Click on blank white area to create edges, clicking again will create a new edge which will automatically get connected to the previous edge
4. Select "(t) Traffic Lights" from the drop down. Select the junctions and click on Create TLS button on the left to add Traffic Signal to it.
5. Select "(c) Connect" from the drop down. Select the lanes and ensure connectivity between them.
6. Create a new folder and save the network file(\*.net.xml) say with a name network.net.xml
7. Open command prompt with the current working directory as the folder where you have saved the network file
8. Using randomtrips.py utility present in <SUMO_INSTALL_DIRECTORY>/tools directory create trips file with the command
   > "C:\sumo-0.32.0\tools\randomTrips.py" -n "network.net.xml" -e 2 --route-file "trips.xml"
9. Create a SUMO configuration file (\*sumo.cfg) which points to the network and trips file, in your folder which contains the network and route file.
10. Open SUMO and then open this SUMO Scenario via NetSim and simulate
