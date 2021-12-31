const fs = require('fs')

const getDatabase = () => {
  const data = fs.readFileSync('./public/database/database.json', 'utf8');
  const json = JSON.parse(data);
  return json
}


const saveDatabase = (json) => {
    const data = JSON.stringify(json);
    fs.writeFileSync('./public/database/database.json', data, 'utf8');
}

const addItem = (item) => {
    const json = getDatabase();
    json.push(item);
    saveDatabase(json);
    return item;
}

const changeItemCount = (id, count) => {
    const json = getDatabase();
    const index = json.findIndex((item) => item.id === id)
    if(index !== -1) {
      json[index].count += count
    } else {
      console.log(`Could not find ${id}`)
    }
    saveDatabase(json);
    return json[index];
}

const getItems = () => {
    const json = getDatabase();
    return json;
}

module.exports = {
  addItem,
  getItems,
  changeItemCount,
}
