<template>
  <div class="contact px-3 py-2" style="position: relative;">
    <div class="contact__data" @click="toggleDropdown(id)">
      <svg class="contact__collapse bi bi-chevron-right"
           :class="{'down': collapsed}"
           xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
      </svg>
      <div class="contact__info">
        <div v-if="!skeletonized">
          <div class="contact__name">
            <div>
              {{ firstName + ' ' + lastName }}
            </div>
          </div>
          <div class="contact__position">
            <div>
              {{ jobTitle }}
            </div>
          </div>
          <div class="contact__company">
            <div>
              {{ 'at ' + (company || 'a company') }}
            </div>
          </div>
          <div class="collapse" :class="{'show' : collapsed}" :id="'contact-' + id">
            <hr>
            <div class="contact__country">
              <div class="contact__label">
                {{ 'location: ' }}
              </div>
              <div class="contact__value">
                {{ (country || 'a country') }}
              </div>
            </div>
            <div class="contact__email">
              <div class="contact__label">
                {{ 'email: ' }}
              </div>
              <div class="contact__value">
                {{ email }}
              </div>
            </div>
            <div class="contact__number">
              <div class="contact__label">
                {{ 'phone: ' }}
              </div>
              <div class="contact__value">
                {{ phone }}
              </div>
            </div>
          </div>
        </div>
        <el-skeleton v-else animated :rows="3"/>
      </div>
    </div>
    <div class="contact__controls dropdown">
      <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"
              aria-expanded="false"></button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" href="#" @click="$emit('remove', id)">delete</a></li>
        <li><a class="dropdown-item" href="#" @click="$emit('edit', id)">edit</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactCard",
  data: () => ({
    collapsed: false,
  }),
  props: {
    skeletonized: {type: Boolean, default: false},
    firstName: {type: String,},
    lastName: {type: String,},
    jobTitle: {type: String,},
    company: {type: String,},
    country: {type: String,},
    email: {type: String,},
    phone: {type: String,},
    id: {type: [String, Number],},
  },
  methods: {
    toggleDropdown() {
      this.collapsed = !this.collapsed;
    }
  }
}
</script>

<style scoped>
::v-deep .el-skeleton__paragraph {
  margin-top: 4px;
}

.contact {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid #c5c5c5;
  border-radius: 8px;
  /*box-shadow: #d3d3d3 0px 3px 4px 0px;*/
}

.contact:hover {
  background: #F8FAF9;
}

.contact__data {
  display: flex;
  gap: 10px;
  position: relative;
  padding-left: 38px;
  padding-right: 20px;
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

.contact__info, .contact__data {
  width: 100%;
}

.contact__name {
  font-weight: 700;
}

.contact__email, .contact__number, .contact__country {
  display: flex;
  gap: 20px;
}

.contact__position, .contact__company {
  font-weight: 300;
}

.contact__label {
  font-weight: 600;
  min-width: 60px;
}

.contact__value {
  font-weight: 300;
}

.contact__controls {
  position: absolute;
  top: 10px;
  right: 4px;
  height: 36px;
}
</style>