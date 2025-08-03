<script>
  let count = $state(0)
  const increment = () => {
    count += 1
  }
</script>

<button 
  class="btn btn-soft btn-secondary" 
  onclick={increment}
>
  count is {count}
</button>
