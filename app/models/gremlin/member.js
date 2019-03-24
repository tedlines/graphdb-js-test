const Conn = require('./gremlin');

// const gremlin = require('gremlin');
// const traversal = gremlin.process.AnonymousTraversalSource.traversal;
// const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
// const Graph = gremlin.structure.Graph;
// const column = gremlin.process.traversal.column;
// const direction = gremlin.process.traversal.direction;
// const p = gremlin.process.traversal.P;
// const pick = gremlin.process.traversal.pick;
// const pop = gremlin.process.traversal.pop;
// const order = gremlin.process.traversal.order;
// const scope = gremlin.process.traversal.scope;
// const t = gremlin.process.traversal.t;

// //const client = new gremlin.driver.Client('ws://gremlin:8182/gremlin', { traversalSource: 'g' });

class Member {
    constructor(){
        
    }

    async getMembers () {
        console.log(" :: Gremlin getMembers ::");
        //console.log("--- Conn :", Conn);
        let result = [];
        try {
            // 이런 쿼리도 가능
            //const member = await client.submit('g.V().hasLabel.(ll).tail(n) ', {ll: 'Members', n: 3});
            // const members = await Conn.g.V().hasLabel('Members').as('members')
            //     .outE('work_for').inV().as('company')
            //     .select('members').valueMap().as('mem')
            //     .select('company').valueMap().as('com')
            //     .select('mem', 'com').toList();
            const members = await Conn.g.V().hasLabel('Members').as('a')
                .project('member_id', 'name', 'age', 'cname')
                .by('member_id')
                .by('name')
                .by('age')
                .by(Conn.g.V().select('a').outE('work_for').inV().hasLabel('Companies').values('name').dedup().fold())
                .toList();
            //console.log(" ------------- result :", members);
            for (const vertex of members) {
                //console.log("====== vertex :", vertex);
                const member = {
                    id: vertex.get('member_id'),
                    name: vertex.get('name'),
                    age: vertex.get('age'),
                    company_name: vertex.get('cname')
                }
                result.push(member);
            }
            return result;
        } catch (exception) {
            console.error('Error : ', exception);
        }
        return false;
    }

    async getMembersByCompanyId (companyId) {
        let result = [];
        try {
            const members = await Conn.g.V().hasLabel('Members').as('b')
                .where(Conn.g.V().select('b').outE('work_for').inV().hasLabel('Companies').has('company_id', companyId)).as('a')
                .project('member_id', 'name', 'age', 'cname')
                .by('member_id')
                .by('name')
                .by('age')
                .by(Conn.g.V().select('a').outE('work_for').inV().hasLabel('Companies').values('name').dedup().fold())
                .toList();
            //console.log(" ------------- result :", members);
            for (const vertex of members) {
                //console.log("====== vertex :", vertex);
                const member = {
                    id: vertex.get('member_id'),
                    name: vertex.get('name'),
                    age: vertex.get('age'),
                    company_name: vertex.get('cname')
                }
                result.push(member);
            }
            console.log("getMembersByCompanyId :", result);
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }

    async addMember (memberId, name, age) {
       // const { t: { id } } = gremlin.process;
        
        try {
            const member = await Conn.g.addV('Members').property('member_id', memberId).property('name',name).property('age',age).next(); // for neptune
            // 이렇게 client.sublimt 도 가능
            //const member = await client.submit("g.addV('Members').property('member_id', 1111).property('name', name).property('age', age).next() ", {memberId: memberId, name: name, age: age});

            //console.log("---- add Member :", member);
            return member;
        } catch (exception) {
            console.error('Error : ', exception);
        }
        return false;
    }

    async addWorkFor (fromMemberId, toCompanyId) {
       // const { t: { id } } = gremlin.process; // for Neptune
        try {
            const result = await Conn.g.V().has('member_id', fromMemberId).addE('work_for').to(Conn.g.V().has('company_id', toCompanyId)).next();
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);        
        }
        return false;
    }
}

module.exports = new Member();