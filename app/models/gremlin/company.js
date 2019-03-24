const Conn = require('./gremlin');

class Company {
    constructor(){
        
    }

    async getCompanies () {
        let result = [];
        try {
            const companies = await Conn.g.V().hasLabel('Companies').as('a')
            .project('company_id', 'name', 'bname')
            .by('company_id')
            .by('name')
            .by(Conn.g.V().select('a').inE('allow_to').outV().hasLabel('Boards').values('name').dedup().fold())
            .toList();
            for (const vertex of companies) {
                const company = {
                    id: vertex.get('company_id'),
                    name: vertex.get('name'),
                    board_name: vertex.get('bname')
                }
                result.push(company);
            }
            return result;
        } catch (exception) {
            console.error('Error : ', exception);
        }
        return false;
    }

    async addCompany (companyId, name) {
        try {
            const company = await Conn.g.addV('Companies').property('company_id', companyId).property('name',name).next(); // for neptune
            console.log("---- add company :", company);
            return company;
        } catch (exception) {
            console.error('Error : ', exception);
        }
        return false;
    }
}

module.exports = new Company();