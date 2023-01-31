<template>
  <form>
    <v-text-field
      v-model="name"
      :error-messages="nameErrors"
      :counter="10"
      label="Name"
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-select
      class="mb-8"
      v-model="select"
      :items="items"
      :error-messages="selectErrors"
      label="Species"
      required
      @change="$v.select.$touch()"
      @blur="$v.select.$touch()"
    ></v-select>

    <v-btn class="mr-4" @click="submit"> Save </v-btn>
    <v-btn @click="clear"> Clear </v-btn>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],

  validations: {
    name: { required },
    select: { required },
  },

  data: () => ({
    name: '',
    select: null,
    items: ['Dog', 'Cat', 'Human'],
    checkbox: false,
  }),

  computed: {
    selectErrors() {
      const errors = []
      if (!this.$v.select.$dirty) return errors
      !this.$v.select.required && errors.push('Species is required')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
  },

  methods: {
    submit() {
      this.$v.$touch()
    },
    clear() {
      this.$v.$reset()
      this.name = ''
      this.select = null
    },
  },
}
</script>
