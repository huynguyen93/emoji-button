let bindings = [];

export function bindKey({ key, callback, target = document }) {
  function listener(event) {
    if (event.key === key) {
      event.preventDefault();
      callback(event);
    }
  }

  target.addEventListener('keydown', listener);

  const newBinding = { target, listener };
  bindings.push(newBinding);

  return function cleanup() {
    target.removeEventListener('keydown', listener);
    bindings = bindings.filter(binding => binding !== newBinding);
  }
}

export function cleanAll() {
  bindings.forEach(binding => {
    binding.target.removeEventListener('keydown', binding.listener);
  })
}