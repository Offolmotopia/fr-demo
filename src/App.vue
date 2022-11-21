<template>
  <el-main>
    <div class="row p-3 justify-content-center">
      <div class="col-lg-6 col-md-10">
        <form-layout/>
      </div>
    </div>
  </el-main>
</template>

<script>
import FormLayout from "@/components/FormLayout";
import {useContactsStore} from "@/stores/Contacts";
import {mapActions} from "pinia";

export default {
  name: 'App',
  components: {
    FormLayout
  },
  methods: {
    ...mapActions(useContactsStore, ['initialize']),
  },
  created() {
    this.initialize()
  }
}
</script>

<style>
* {
  transition: all 0.3s ease;
  font-family: 'Lato', sans-serif;
}

body {

  overflow-x: hidden;
}

#app {
  width: 100%;
}
</style>
