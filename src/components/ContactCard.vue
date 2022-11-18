<template>
  <div class="contact px-3 py-2">
    <div class="contact__data">
      <svg class="contact__collapse bi bi-chevron-right"
           :ref="'contact-' + id"
           @click="toggleDropdown(id)"
           data-bs-toggle="collapse"
           :data-bs-target="'#contact-' + id"
           xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
      </svg>
      <div class="contact__info">
        <div class="contact__name" style="font-weight: 700;">{{ firstName + ' ' + lastName }}</div>
        <div class="contact__position" style="font-weight: 300;">{{ jobTitle }}</div>
        <div class="contact__company" style="font-weight: 300;">{{ 'at ' + company }}</div>

        <div class="collapse" :id="'contact-' + id">
          <hr>
          <div class="contact__country" style="font-weight: 400;">{{ 'location: ' + country }}</div>
          <div class="contact__email">{{ email }}</div>
          <div class="contact__number">{{ phone }}</div>
        </div>
      </div>
    </div>
    <div>
      <div class="contact__controls dropdown" style="position: relative;">
        <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"
                aria-expanded="false"></button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li><a class="dropdown-item" href="#" @click="$emit('remove', id)">delete</a></li>
          <li><a class="dropdown-item" href="#" @click="$emit('edit', id)">edit</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactCard",
  props: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    jobTitle: {type: String, required: true},
    company: {type: String, required: true},
    country: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    id: {type: [String, Number], required: true},
  },
  methods: {
    toggleDropdown() {
      this.$emit('show-info', {id: this.id,ref: this.$refs[`contact-${this.id}`]})
    }
  }
}
</script>

<style scoped>
.contact {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid #c5c5c5;
  border-radius: 8px;
  box-shadow: #d3d3d3 0px 3px 4px 0px;
}

.contact:hover {
  background: #F8FAF9;
}

.contact__data {
  display: flex;
  gap: 10px;
  position: relative;
  padding-left: 38px;
}

.contact__collapse {
  position: absolute;
  top: 20px;
  left: 4px;
  cursor: pointer;
}

.down {
  transform: rotate(90deg);
}

.contact__controls {
  display: flex;
  gap: 16px;
}
</style>