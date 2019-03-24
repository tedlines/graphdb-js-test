const Conn = require('./gremlin');

class Board {
    constructor(){
    }

    async getArticles () {
        let result = [];
        try {
            const articles = await Conn.g.V().hasLabel('Articles').as('a')
                .project('article_id', 'title', 'bname', 'mname')
                .by('article_id')
                .by('title')
                .by(Conn.g.V().select('a').outE('belong_to').inV().hasLabel('Boards').values('name').dedup().fold())
                .by(Conn.g.V().select('a').outE('written_by').inV().hasLabel('Members').values('name').dedup().fold())
                .toList();
            
            for (const vertex of articles) {
                const article = {
                    id: vertex.get('article_id'),
                    title: vertex.get('title'),
                    board_name: vertex.get('bname'),
                    member_name: vertex.get('mname')
                }
                result.push(article);
            }
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }

    async getArticlesByBoardId (boardId) {
        let result = [];
        try {
            const articles = await Conn.g.V().hasLabel('Articles').as('b')
                .where(Conn.g.V().select('b').outE('belong_to').inV().hasLabel('Boards').has('board_id', boardId)).as('a')
                .project('article_id', 'title', 'bname', 'mname')
                .by('article_id')
                .by('title')
                .by(Conn.g.V().select('a').outE('belong_to').inV().hasLabel('Boards').values('name').dedup().fold())
                .by(Conn.g.V().select('a').outE('written_by').inV().hasLabel('Members').values('name').dedup().fold())
                .toList();
            console.log("====== getArticlesByBoardId articles :", articles);
            for (const vertex of articles) {
                const article = {
                    id: vertex.get('article_id'),
                    title: vertex.get('title'),
                    board_name: vertex.get('bname'),
                    member_name: vertex.get('mname')
                }
                result.push(article);
            }
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;    
    }

    async getArticle (articleId) {
        try {
            let article = await Conn.g.V().hasLabel('Articles').has('article_id', articleId).as('a')
                .project('article_id', 'title', 'content', 'bname', 'mname')
                .by('article_id')
                .by('title')
                .by('content')
                .by(Conn.g.V().select('a').outE('belong_to').inV().hasLabel('Boards').values('name').dedup().fold())
                .by(Conn.g.V().select('a').outE('written_by').inV().hasLabel('Members').values('name').dedup().fold())
                .next();
            console.log("----- getArticle :", article.value);
            const result = {
                id: article.value.get('article_id'),
                title: article.value.get('title'),
                content: article.value.get('content'),
                board_name: article.value.get('bname'),
                member_name: article.value.get('mname')
            }
            const ret = [result];
            return ret;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }

    async getArticlesReadByCompanyMembers (companyId) {
        let result = [];
        try {
            let articles = await Conn.g.V().hasLabel('Companies').has('company_id', companyId).as('a')
            .inE('work_for').outV().inE('read_by').outV().hasLabel('Articles').as('b')
            .project('cname', 'article_id', 'title', 'mname', 'bname')
            .by(Conn.g.V().select('a').values('name').dedup())
            .by(Conn.g.V().select('b').values('article_id').dedup())
            .by(Conn.g.V().select('b').values('title').dedup())
            .by(Conn.g.V().select('b').outE('read_by').inV().hasLabel('Members').values('name').dedup().fold())
            .by(Conn.g.V().select('b').outE('belong_to').inV().hasLabel('Boards').values('name').dedup().fold())
            .toList();       
            console.log("====== getArticlesReadByCompanyMembers articles :", articles);
            for (const vertex of articles) {
                const article = {
                    id: vertex.get('article_id'),
                    title: vertex.get('title'),
                    member_name: vertex.get('mname'),
                    company_name: vertex.get('cname'),
                    board_name: vertex.get('bname')
                }
                result.push(article);
            }       
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }

    async addArticle (articleId, title, content) {
        // const { t: { id } } = gremlin.process;
         
        try {
            const article = await Conn.g.addV('Articles').property('article_id', articleId).property('title',title).property('content',content).next();
            
            console.log("---- add Article :", article);
            return article;
        } catch (exception) {
            console.error('Error : ', exception);
        }
        return false;
    }

    async addBelongTo (fromArticleId, toBoardId) {
    // const { t: { id } } = gremlin.process; // for Neptune
        try {
            const result = await Conn.g.V().has('article_id', fromArticleId).addE('belong_to').to(Conn.g.V().has('board_id', toBoardId)).next();
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);        
        }
        return false;
    }

    async addWrittenBy (fromArticleId, toMemberId) {
    // const { t: { id } } = gremlin.process; // for Neptune
        try {
            const result = await Conn.g.V().has('article_id', fromArticleId).addE('written_by').to(Conn.g.V().has('member_id', toMemberId)).next();
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);        
        }
        return false;
    }
     
    async addReadBy (fromArticleId, toMemberId){
    // const { t: { id } } = gremlin.process; // for Neptune
        try {
            const result = await Conn.g.V().has('article_id', fromArticleId).addE('read_by').to(Conn.g.V().has('member_id', toMemberId)).next();
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);        
        }
        return false;
    }
}

module.exports = new Board();