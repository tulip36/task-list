const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'tasks.json');

function loadTasks() {
  if (!fs.existsSync(DB_FILE)) {
    return [];
  }
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2));
}

function addTask(title) {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now().toString(),
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`任务已添加: ${title}`);
}

function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('暂无任务');
    return;
  }
  tasks.forEach((task, index) => {
    const status = task.completed ? '[x]' : '[ ]';
    console.log(`${index + 1}. ${status} ${task.title}`);
  });
}

function completeTask(id) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = true;
    saveTasks(tasks);
    console.log(`任务已完成: ${task.title}`);
  } else {
    console.log('未找到任务');
  }
}

function deleteTask(id) {
  const tasks = loadTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    const deleted = tasks.splice(index, 1)[0];
    saveTasks(tasks);
    console.log(`任务已删除: ${deleted.title}`);
  } else {
    console.log('未找到任务');
  }
}

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'add':
    if (!arg) {
      console.log('请输入任务标题');
      process.exit(1);
    }
    addTask(arg);
    break;
  case 'list':
    listTasks();
    break;
  case 'complete':
    if (!arg) {
      console.log('请输入任务 ID');
      process.exit(1);
    }
    completeTask(arg);
    break;
  case 'delete':
    if (!arg) {
      console.log('请输入任务 ID');
      process.exit(1);
    }
    deleteTask(arg);
    break;
  default:
    console.log('用法:');
    console.log('  node index.js add <title>      - 添加任务');
    console.log('  node index.js list            - 列出所有任务');
    console.log('  node index.js complete <id>   - 完成任务');
    console.log('  node index.js delete <id>     - 删除任务');
}
