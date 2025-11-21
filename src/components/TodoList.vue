<script setup>
import { ref, computed, watchEffect } from 'vue'

// --- 1. 數據結構定義與初始化 ---

/**
 * @typedef {Object} Todo
 * @property {number} id - 待辦事項的唯一ID
 * @property {string} text - 待辦事項的內容
 * @property {boolean} completed - 待辦事項的完成狀態
 */

// 從 localStorage 載入數據，如果沒有，則使用空陣列
const loadTodos = () => {
  const saved = localStorage.getItem('vue-todo-list')
  return saved ? JSON.parse(saved) : []
}

/** @type {import('vue').Ref<Todo[]>} */
const todos = ref(loadTodos())

/** @type {import('vue').Ref<string>} */
const newTodoText = ref('')

/** @type {import('vue').Ref<'all'|'active'|'completed'>} */
const currentFilter = ref('all')

// --- 2. 資料儲存：監聽 todos 變化並存入 localStorage ---
// watchEffect 會在初始時執行一次，並追蹤其內部依賴 (todos.value) 的變化。
watchEffect(() => {
  localStorage.setItem('vue-todo-list', JSON.stringify(todos.value))
})

// --- 3. 核心功能函式 ---

/**
 * 新增待辦事項
 */
const addTodo = () => {
  if (newTodoText.value.trim() === '') return

  const newTodo = {
    id: Date.now(), // 簡單的唯一ID
    text: newTodoText.value.trim(),
    completed: false
  }

  todos.value.push(newTodo)
  newTodoText.value = '' // 清空輸入框
}

/**
 * 刪除待辦事項
 * @param {number} todoId - 要刪除的待辦事項ID
 */
const removeTodo = (todoId) => {
  todos.value = todos.value.filter(todo => todo.id !== todoId)
}

/**
 * 切換待辦事項的完成狀態
 * @param {Todo} todo - 要切換狀態的待辦事項物件
 */
const toggleCompletion = (todo) => {
  todo.completed = !todo.completed
}

/**
 * 設置當前的篩選條件
 * @param {'all'|'active'|'completed'} filter - 篩選條件
 */
const setFilter = (filter) => {
  currentFilter.value = filter
}

// --- 4. 狀態篩選與計算屬性 (Computed Properties) ---

/**
 * 根據 currentFilter 計算要顯示的待辦事項清單
 */
const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    case 'all':
    default:
      return todos.value
  }
})

/**
 * 計算待處理 (Active) 項目的數量
 */
const activeCount = computed(() => {
  return todos.value.filter(todo => !todo.completed).length
})

</script>

<template>
  <div class="todo-app">
    <h1>📝 待辦事項清單</h1>

    <form @submit.prevent="addTodo" class="todo-form">
      <input
        type="text"
        v-model="newTodoText"
        placeholder="新增待辦事項..."
        autofocus
      >
      <button type="submit">新增</button>
    </form>

    <ul class="todo-list">
      <li v-if="todos.length === 0" class="empty-message">
        目前沒有待辦事項！
      </li>
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
      >
        <span
          :class="{ completed: todo.completed }"
          @click="toggleCompletion(todo)"
          class="todo-text"
        >
          {{ todo.text }}
        </span>
        
        <button class="delete-btn" @click="removeTodo(todo.id)">刪除</button>
      </li>
    </ul>

    <div v-if="todos.length > 0" class="todo-footer">
      <span class="count">{{ activeCount }} 待處理項目</span>

      <div class="filters">
        <button
          @click="setFilter('all')"
          :class="{ active: currentFilter === 'all' }"
        >
          全部 (All)
        </button>
        <button
          @click="setFilter('active')"
          :class="{ active: currentFilter === 'active' }"
        >
          待處理 (Active)
        </button>
        <button
          @click="setFilter('completed')"
          :class="{ active: currentFilter === 'completed' }"
        >
          已完成 (Completed)
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

/* --- Form Styles --- */
.todo-form {
  display: flex;
  margin-bottom: 20px;
}

.todo-form input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.todo-form button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.todo-form button:hover {
  background-color: #0056b3;
}

/* --- List Styles --- */
.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.todo-text {
  flex-grow: 1;
  cursor: pointer;
  padding: 5px 0;
  transition: color 0.2s;
}

/* 狀態標記：文字劃線樣式 */
.todo-text.completed {
  text-decoration: line-through;
  color: #999;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #c82333;
}

.empty-message {
    text-align: center;
    color: #6c757d;
    padding: 20px;
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    border-radius: 4px;
}

/* --- Footer & Filters --- */
.todo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.count {
  color: #6c757d;
}

.filters button {
  background: none;
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin-left: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.filters button:hover {
  border-color: #007bff;
  color: #007bff;
}

.filters button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
</style>