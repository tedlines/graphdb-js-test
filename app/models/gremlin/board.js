const Conn = require('./gremlin');

class Board {
    constructor(){
    }

    async getBoards () {
        let result = [];
        try {
            const boards = await Conn.g.V().hasLabel('Boards').as('a')
                .project('board_id', 'name', 'cname')
                .by('board_id')
                .by('name')
                .by(Conn.g.V().select('a').outE('allow_to').inV().hasLabel('Companies').values('name').dedup().fold())
                .toList();
            
            for (const vertex of boards) {
                const board = {
                    id: vertex.get('board_id'),
                    name: vertex.get('name'),
                    company_name: vertex.get('cname')
                }
                result.push(board);
            }
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }

    async addBoard (boardId, name)  {
        // const { t: { id } } = gremlin.process;
         
         try {
             const board = await Conn.g.addV('Boards').property('board_id', boardId).property('name',name).next(); // for neptune
              
             console.log("---- add board :", board);
             return board;
         } catch (exception) {
             console.error('Error : ', exception);
         }
         return false;
     }
 
     async addAllowTo (fromBoardId, toCompanyId) {
        // const { t: { id } } = gremlin.process; // for Neptune
         try {
             const result = await Conn.g.V().has('board_id', fromBoardId).addE('allow_to').to(Conn.g.V().has('company_id', toCompanyId)).next();
             console.log(result);
             return result;
         } catch (err) {
             console.log(err);        
         }
         return false;
     }
}

module.exports = new Board();