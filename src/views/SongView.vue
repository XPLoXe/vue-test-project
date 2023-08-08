<template>
  <div>
    <!--this will hold the dynamic segments in the route-->
    {{ $route.params.id }}
  </div>
</template>

<script>
export default {
  name: 'SongView'
}
</script>
