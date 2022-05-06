const {
    Pool
} = require('pg');
const {
    nanoid
} = require('nanoid');
const NotFoundError = require('./../../exceptions/NotFoundError');
const InvariantError = require('./../../exceptions/InvariantError');
// const { not } = require('joi');

class ActivitiesService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;

    }

    async verifyAlbumExist(Id) {
        const query = {
            text: `SELECT id FROM albums WHERE id = $1 `,
            values: [Id],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0]) {
            throw new NotFoundError;
        }

        return result.rows;


    }

    async checkUserLike(id, credentialId) {
        const query = {
            text: `SELECT * FROM user_album_likes WHERE user_id = $2 AND album_id = $1 `,
            values: [id, credentialId],
        };

        const result = await this._pool.query(query);
      
        if (result.rows.length) {
            return false;
        }

        return true;


    }

    async addUserLike(id, credentialId) {
        const like_id = `likes-${nanoid(16)}`;
        const query = {
            text: `INSERT INTO user_album_likes VALUES($1, $2, $3 ) RETURNING id`,
            values: [like_id, credentialId, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Likes gagal ditambahkan');
        }
        await this._cacheService.delete(`likes:${id}`);

        

    }

    async delUserLike(id, credentialId) {

        const query = {
            text: `DELETE FROM user_album_likes WHERE user_id =$2 AND album_id = $1  `,
            values: [id, credentialId],
        };

        await this._pool.query(query);

        
        // return true;
        await this._cacheService.delete(`likes:${id}`);
    }
    async getLikes(id) {
        try {
            //mendapatkan likes dari cache
            const total = JSON.parse(await this._cacheService.get(`likes:${id}`));
            //console.log(result);
            const cache = true;
            const finalResult = {total, cache};
            return finalResult;
            
        } catch (error) {
            const query = {
                text: `SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1`,
                values: [id],

            };

            const result = await this._pool.query(query);   
            const total = result.rows[0].count;
            const cache = false;
            const finalResult = {total, cache}
            await this._cacheService.set(`likes:${id}`, result.rows[0].count);
            return finalResult;
        }


    }

}

module.exports = ActivitiesService;