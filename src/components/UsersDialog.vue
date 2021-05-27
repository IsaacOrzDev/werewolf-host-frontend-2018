<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-content>
        <md-field v-for="(player, index) in playerResult" :key="index" class="name-input">
          <label>{{player.no}}號{{player.name}}</label>
          <md-input v-model="player.realName"></md-input>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions class="bottom-container">
        <md-button class="primary-button" @click="onComplete">確定</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'UsersDialog',
  props: ['show', 'players'],
  components: {
  },
  data: () => ({
    showDialog: false,
    playerResult: []
  }),
  created() {
    this.showDialog = this.show;
    this.playerResult = this.players;
  },
  watch: {
    show: function(newValue, oldValue) {
      this.showDialog = newValue;
    },
    showDialog: function(newValue, oldValue) {
      if (newValue == false) {
        this.$emit('cancel');
      }
    },
  },
  computed: {
    ...mapGetters({
      daySpeech: 'game/daySpeech',
      nightActions: 'game/nightActions',
      dayActions: 'game/dayActions',
      round: 'game/round',
    }),
  },
  methods: {
    onComplete: function() {
      this.$emit('complete', this.playerResult);
    },
    onCancel: function() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.md-dialog {
  background: rgba(#4e3934, 1);
  color: #fff;
  width: 50%;
  max-height: 65vh;

  .content-container {
    overflow-x: hidden;
    line-height: 1;

    .action-button {
      background: rgba(0, 0, 0, 0.05);
      color: #fff !important;
      width: 100%;

      &:first-child {
        margin-left: 0 !important;
      }
    }
  }

  .bottom-container {
    padding: 15px 8px;
    min-height: 0;

    .primary-button {
      background: rgba(0, 0, 0, 0.1);
      width: 100%;
      color: #fff;

      &:first-child {
        margin-left: 0 !important;
      }
    }
  }
}

.log {
  margin: 0;
  margin-bottom: 8px;
}

/deep/ .name-input {
  margin-bottom: 5px;
  border-bottom: 1px solid #fff;
  input {
    color: #fff;
  }
}
</style>
