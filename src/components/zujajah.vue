<template>
<div class="main">
  <div class="ui two column centered grid">
    <div class="four wide column">
      <div class="ui vertical menu">
        <div class="item" v-for="(cat, index) in category.Categories" :key="index">
          <div class="header">{{cat.Title}}</div>
          <div class="menu">
            <div class="item link" v-for="(subCat, index) in cat.Subcategories" :key="index" v-on:click="showCourses(subCat.Category, index)">{{subCat.Title}}</div>
          </div>
      </div>
    </div>
    <div class="ui sticky">
      <div class="ui card">
          <div class="ui segment">
            <!-- <div v-show="trackProgress == 0" class="ui active dimmer">
              <div class="ui indeterminate text loader">Waiting for Audio</div>
            </div> -->
            <div v-if="current" class="content">
              <h4>{{current}}</h4>
              <br>
            </div>
            <div v-else class="content">
              <h4>No audio is selected</h4>
              <br>
            </div>
            <div class="content center aligned">
              <button v-on:click="play" class="ui teal icon button" id="play-button" data-content="Play/Pause">
                <i class="play icon"></i>
              </button>
              <button v-on:click="rvrseBtn" class="ui teal icon button" id="play-button" data-content="-10s">
                <i class="step backward icon"></i>
              </button>
              <button v-on:click="frwrdBtn" class="ui teal icon button" id="play-button" data-content="+10s">
                <i class="step forward icon"></i>
              </button>
              <a class="ui teal icon button" :href="resource" :download="download" target=”_blank” data-content="Right-click to Download">
                <i class="download icon"></i>
              </a>
            </div>
            <div class="content center aligned">
              <input id="trackProgressBar" v-model="trackProgress" type="range" min="0" :max="trackDuration">
              <div class="ui three column centered grid">
                <div class="six wide column"><strong>{{currentDuration}}</strong></div>
                <div class="two wide column"><strong>/</strong></div>
                <div class="six wide column"><strong>{{totalDuration}}</strong></div>
              </div>
            </div>
            <div class="content">
              <audio class="" @durationchange="trackDuration = $event.target.duration" @timeupdate="trackProgress = $event.target.currentTime"
                controls>
                <source :src="resource">
              </audio>
            </div>
          </div>
        </div>
        </div>
    </div>
    <div class="twelve wide column" id="context">
      <div class="row">
        <div class="ui text menu">
          <div class="item">
            <img src="/images/alhuda-media.png">
          </div>
          <div class="ui dropdown item" v-dropdown>
            <div class="text">Browse Courses</div>
            <i class="dropdown icon"></i>
            <div class="menu">
              <div class="item" v-for="(crs, index) in courses" :key="index" v-on:click="getCourse(crs.Keyword)">{{crs.Title}}
              </div>
            </div>
          </div>
          <div class="item">
            <div class="ui left pointing red label" v-show="courses.length == 0">Select a category from sidebar</div>
            <div class="ui left pointing green label" v-show="courses.length != 0">Browse Courses in {{selected}}<div class="detail">{{courses.length}}</div></div>
          </div>
          <div class="ui right dropdown item" v-dropdown>
            <div class="text">More</div>
            <i class="dropdown icon"></i>
            <div class="menu">
              <a class="item">Applications</a>
              <a class="item">International Students</a>
              <a class="item">Scholarships</a>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div v-if="course.length != 0" class="sixteen wide column">
          <div class="ui accordion fluid styled" v-accordion>
            <div v-for="(top, index) in course.Course.Topic" :key="index">
              <div class="title">
                <i class="dropdown icon"></i>{{top.Title}}</div>
              <div class="content">
                <div class="ui accordion" v-for="(les, index) in top.Lesson" :key="index">
                  <div class="title">
                    <i class="dropdown icon"></i>{{les.Title}}</div>
                  <div class="content">
                    <div class="ui divided list selection">
                      <div class="item" v-for="(res, index) in les.Resource" :key="index" v-on:click="loadAudio(res.DownloadLocation, res.Title)">
                        <i class="play large middle aligned icon"></i>
                        <div class="content">
                          <div class="header">{{res.Title}}</div>
                          <div class="description">Duration: {{res.Duration}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>    
        <div v-show="loader" class="sixteen wide column">
          <div class="ui segment">
            <div class="ui active inverted dimmer">
              <div class="ui medium text loader">Loading Files</div>
            </div>
            <br><br><br><br><br><br><br>
          </div>
        </div>
        <resize-observer @notify="refreshSticky" />
      </div>
    </div>
  </div>
  <ul v-if="errors && errors.length">
    <li v-for="error of errors" :key='error'>
      {{error.message}}
    </li>
  </ul>
</div>
</template>

<script>
import axios from 'axios'
// import _ from 'lodash'

export default {
  name: 'zujajah',

  data () {
    return {
      category: [],
      courses: [],
      selected: '',
      current: '',
      course: [],
      resource: '',
      loader: false,
      trackProgress: 0,
      trackDuration: 0,
      currentDuration: '00:00:00',
      totalDuration: '00:00:00',
      errors: []
    }
  },

  created () {
    axios.get('/resources/categories.json')
      .then(response => {
        this.category = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
      $(document).ready(function () {
        $('.ui.teal.icon.button').popup()
      })
  },

  methods: {
    play: function () {
      if ($('audio')[0].paused) {
        $('audio')[0].oncanplay = $('audio')[0].play()
      } else {
        $('audio')[0].pause()
      }
      if (!$('audio')[0].paused) {
        $('#play-button').toggleClass('active')
        $('#play-button').find('i').removeClass('play')
        $('#play-button').find('i').addClass('pause')
      } else {
        $('#play-button').toggleClass('active')
        $('#play-button').find('i').removeClass('pause')
        $('#play-button').find('i').addClass('play')
      }
    },
    loadAudio: function (res, ttl) {
      this.trackProgress = 0
      this.resource = 'http://alhudamedia.com/' + res
      this.current = ttl
      $('#play-button').addClass('active')
      $('#play-button').find('i').removeClass('play')
      $('#play-button').find('i').addClass('pause')
    },
    getCourse: function (val) {
      this.courses = []
      this.loader = true
      axios.get('/resources/xmls/' + val + '.json')
        .then(response => {
          this.course = response.data
          $('.accordion .active').removeClass('active')
          this.loader = false
          $('.ui.sticky').sticky({
            offset: 10,
            bottomOffset: 10,
            context: "#context"
          })
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    showCourses: function (cat, ind) {
      this.courses = this.category.Categories[cat].Subcategories[ind].Courses
      this.selected = this.category.Categories[cat].Subcategories[ind].Title 
    },
    refreshSticky: function () {
      $('.ui.sticky').sticky('refresh')
    },
    updateTime: function (dur) {
      var totalDurHour = Math.floor(Math.floor(dur) / 3600)
      var totalDurMin = Math.floor(Math.floor(dur / 60) % 60)
      var totalDurSec = Math.floor(dur) % 60
      this.totalDuration = (totalDurHour < 10 ? '0' + totalDurHour : totalDurHour) +
        ':' + (totalDurMin < 10 ? '0' + totalDurMin : totalDurMin) +
        ':' + (totalDurSec < 10 ? '0' + totalDurSec : totalDurSec)
      this.currentDuration = '00:00:00'
    },
    updateProgress: function (prog, divider) {
      var currentDurHour = Math.floor(Math.floor(prog / divider) / 3600)
      var currentDurMin = Math.floor(Math.floor((prog / divider) / 60) % 60)
      var currentDurSec = Math.floor(prog / divider) % 60
      this.currentDuration = (currentDurHour < 10 ? '0' + currentDurHour : currentDurHour) +
      ':' + (currentDurMin < 10 ? '0' + currentDurMin : currentDurMin) +
      ':' + (currentDurSec < 10 ? '0' + currentDurSec : currentDurSec)
    },
    frwrdBtn: function() {
      this.trackProgress += 10;
    },
    rvrseBtn: function() {
      this.trackProgress -= 10;
    },
  },

  watch: {
    resource: (url) => {
      $('audio')[0].load(url)
      $('audio')[0].play()
    },
    trackProgress: function (tim) {
      if (Math.abs(tim - $('audio')[0].currentTime) > 0.5) {
        $('audio')[0].currentTime = tim
      }
      this.updateProgress(this.trackProgress, 1)
    },
    trackDuration: function (dur) {
      this.updateTime(dur)
    }
  },

  computed: {
    download: function () {
        return this.current.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')        // Remove all non-word chars
        .replace(/--+/g, '-')           // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text
        .concat('.mp3');                // Add mp3 to the end
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}

audio {
  display: none;
}

.debug div {
  border: 1px solid lightgoldenrodyellow;
}

.main {
  padding: 1em;
  max-width: 950px;
  margin: 0 auto;
  text-align: left;
}

.ui.sticky {
  margin-top: 0.8em;
  width: 15rem;
}

.ui.styled.accordion .accordion .content {
  padding: 0;
}

.ui.three.column.centered.grid .column {
  padding-top: 0;
}

#trackProgressBar {
    width: 100%;
    margin: 0;
    margin-top: 20px;
}

input[type=range]#trackProgressBar {
    -webkit-appearance: none;
    margin: 18px 0;
    width: 100%;
    margin-top: 8px;
}

input[type=range]#trackProgressBar:focus {
    outline: none;
    border: none;
}

input[type=range]#trackProgressBar::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    box-shadow: none;
    background: #00b5ad;
    border-radius: 1.3px;
    border: 10px solid #00b5ad;
    border-right: none;
    border-left: none;
}

input[type=range]#trackProgressBar::-webkit-slider-thumb {
    box-shadow: 0 0 5px 0 rgba(34,36,38,.15) inset;
    border: none;
    height: 20px;
    width: 10px;
    border-radius: 0px;
    background: white;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -10px;
}

input[type=range]#trackProgressBar:focus::-webkit-slider-runnable-track {
    background: #00b5ad;
}

input[type=range]#trackProgressBar::-moz-range-track {
    width: 100%;
    height: 0px;
    cursor: pointer;
    box-shadow: none;
    background: #00b5ad;
    border-radius: 1.3px;
    border: 10px solid #00b5ad;
    border-right: none;
    border-left: none;
}

input[type=range]#trackProgressBar::-moz-range-thumb {
    box-shadow: 0 0 5px 0 rgba(34,36,38,.15) inset;
    border: none;
    height: 20px;
    width: 10px;
    border-radius: 0px;
    background: white;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -10px;
}

input[type=range]#trackProgressBar::-ms-track {
    width: 100%;
    height: 0px;
    cursor: pointer;
    background: #00b5ad;
    border-color: #00b5ad;
    border-width: 10px 0;
    color: transparent;
}

input[type=range]#trackProgressBar::-ms-fill-lower {
    background: #0096c1;
    border: none;
    border-radius: 0px;
    box-shadow: none;
}

input[type=range]#trackProgressBar::-ms-fill-upper {
    background: #00b5ad;
    border: none;
    border-radius: 0px;
    box-shadow: none;
}

input[type=range]#trackProgressBar::-ms-thumb {
    box-shadow: 0 0 5px 0 rgba(34,36,38,.15) inset;
    border: none;
    height: 20px;
    width: 10px;
    border-radius: 0px;
    background: white;
    cursor: pointer;
    margin-top: 0px;
}

input[type=range]#trackProgressBar:focus::-ms-fill-lower {
    background: #00b5ad;
}

input[type=range]#trackProgressBar:focus::-ms-fill-upper {
    background: #00b5ad;
}

</style>
