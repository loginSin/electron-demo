function sayHello(name) {
  const who = name || 'World';
  return `💡 Hello from SDK, ${who}!`;
}

module.exports = {
  sayHello,
};

