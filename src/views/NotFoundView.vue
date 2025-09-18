<script setup lang="ts"></script>

<template>
<div>
    <h1>Not Found</h1>
    <p>
        We couldn't find that page.Try going<p></p>
        <router-link to="/" class="error-link">Home</router-link>
    </p>
</div>
</template>

<style scoped>
.error-link{
    color:rgb(10, 209, 216);
}
</style>
