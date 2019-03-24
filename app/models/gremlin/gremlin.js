const gremlin = require('gremlin');
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;


class DbFactory {
    constructor() {
        
        const dc = new DriverRemoteConnection('ws://gremlin:8182/gremlin', {traversalSource: "g" });

        const graph = new Graph();
        this.g = graph.traversal().withRemote(dc);  
    
    }
  
}
  
module.exports = new DbFactory();