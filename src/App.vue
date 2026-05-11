<template>
  <div class="app">
    <header class="header">
      <h1>Philosophy Geo</h1>
    </header>
    <main class="main">
      <p>项目初始化完成</p>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #1a1a1a;
  color: #fff;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background: rgba(20, 20, 20, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
