const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    const tasks = await Task.find();
    res.render('tasks', { tasks });
};

exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    await Task.create({ title, description });
    res.redirect('/tasks');
};

exports.deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
};
