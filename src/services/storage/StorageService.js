const { Pool } = require('pg');
const fs = require('fs');
const NotFoundError = require('../../exceptions/NotFoundError');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._pool = new Pool();
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }
 
  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;
 
    const fileStream = fs.createWriteStream(path);
 
    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async editAlbumById(id, meta) {
    const filename = +new Date() + meta.filename;
    const path = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [path, id],
    };

    const result = await this._pool.query(query);
    
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }
}

  module.exports = StorageService;