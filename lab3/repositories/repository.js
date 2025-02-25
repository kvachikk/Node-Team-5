class Repository {
    constructor(initialData = []) {
        this.data = initialData;
    }

    async getAll() {
        try {
            return this.data;
        } catch (error) {
            throw new Error("Error retrieving all data");
        }
    }

    async getById(id) {
        try {
            const item = this.data.find(item => item.id === id);
            if (!item) throw new Error(`Item with ID ${id} not found`);
            return item;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async create(newItem) {
        try {
            if (!newItem.name || !newItem.description) {
                throw new Error("Name and description are required");
            }
            const id = this.data.length ? this.data[this.data.length - 1].id + 1 : 1;
            const item = {id, ...newItem};
            this.data.push(item);
            return item;
        } catch (error) {
            throw new Error(`Error creating item: ${error.message}`);
        }
    }


}

module.exports = Repository;
