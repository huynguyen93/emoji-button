type Binding = {
  target: HTMLElement;
  listener: (event: KeyboardEvent) => void;
};

let bindings: Binding[] = [];

type BindKeyOptions = {
  key: string;
  callback: (event: KeyboardEvent) => void;
  target: HTMLElement;
}

export function bindKey({ key, callback, target = document.body }: BindKeyOptions): () => void {
  function listener(event: KeyboardEvent) {
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

export function cleanAll(): void {
  bindings.forEach(binding => {
    binding.target.removeEventListener('keydown', binding.listener);
  })
}