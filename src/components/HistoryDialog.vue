<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-tabs md-dynamic-height class="content-container" md-alignment="fixed">
        <md-tab md-label="日誌">
          <SpeechText fontSize="14px" v-for="speech in daySpeech" :key="speech">{{speech}}</SpeechText>
        </md-tab>
        <md-tab md-label="記錄">
          <p class="log" v-for="history in histories" :key="history">{{history}}</p>
        </md-tab>
      </md-tabs>
      <md-dialog-actions class="bottom-container">
        <md-button class="primary-button" @click="onComplete">確定</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import SpeechText from '@/components/text/SpeechText';
import { mapGetters } from 'vuex';

export default {
  name: 'HistoryDialog',
  props: ['show'],
  components: {
    SpeechText,
  },
  data: () => ({
    showDialog: false,
  }),
  created() {
    this.showDialog = this.show;
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
    histories: function() {
      let result = [];
      for (let i = 0; i <= this.round; i++) {
        this.nightActions
          .filter((action) => action.round == i)
          .forEach((action) => {
            let message = `第${i + 1}晚: ${action.name}${action.action}了`;
            if(action.target != -1) message += `${action.target}號`;
            result.push(message);
          });
        this.dayActions
          .filter((action) => action.round == i)
          .forEach((action) => {
            let message = `第${i + 1}早: ${action.name}${action.action}了`;
            if(action.target != -1) message += `${action.target}號`;
            result.push(message);
          });
      }
      return result;
    },
  },
  methods: {
    onComplete: function() {
      this.$emit('complete', { player: this.player, action: this.action });
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
  max-height: 50vh;

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
    padding: 0 8px;
    min-height: 0;

    .primary-button {
      background: rgba(0, 0, 0, 0.1);
      width: 50%;
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

/deep/ .md-tab-nav-button {
  color: #ffeeff;
}
</style>
