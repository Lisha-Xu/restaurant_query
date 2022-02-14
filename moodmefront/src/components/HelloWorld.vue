<template>
  <div class="main">
    <h1>Restaurant Search</h1>
    <div class="filter">
      <form>
        <p>name: <input type="text" v-model.trim = "queryValue.name" placeholder="restaurant name (optional)"></p>
        <section>
        sort by: <input type="radio" value="cuisine" id="cuisine" v-model="queryValue.picked">cuisine
        <input type="radio" value="avgscore" id="avgscore" v-model="queryValue.picked"><label for="avgscore">average score</label>
        <input type="radio" value="popular" id="popular" v-model="queryValue.picked"><label for="popular">most rated</label>
          <input type="radio" value="null" id="null" v-model="queryValue.picked"><label for="null">no require</label>
        </section>
        <p>get <input v-model="queryValue.num_record" placeholder="number (optional)"> records and <input v-model="queryValue.num_pages" placeholder="number (optional)"> pages.</p>
        <p><button @click="submit($event)">search</button></p>
      </form>
    </div>
    <div class="result" v-show = "flag == 1" >
      <table style="margin: 0 auto; border-collapse: collapse;" border="2" >
        <tr><th>Name</th><th>id</th><th>address building</th><th>address street</th><th>cuisine</th><th v-show ="queryValue.picked == null || queryValue.picked === 'null' || queryValue.picked === 'cuisine'"> grades date, level, score</th><th v-show ="queryValue.picked === 'avgscore'">average score</th><th v-show ="queryValue.picked === 'popular'">nums of grades</th></tr>

        <tr v-for="(item,id) in info" :key = "id" style="border-bottom: 2px solid" >
          <td>{{item.name}}</td><td>{{item.restaurant_id}}</td><td>{{item.address.building}}</td><td>{{item.address.street}}</td><td>{{item.cuisine}}</td>
          <div v-show = "queryValue.picked == null ||queryValue.picked === 'null' || queryValue.picked === 'cuisine'">
            <div v-for="(part, key) in item.grades" :key="key" style="flex: auto">
              <td>{{part.date}}</td><td>{{part.grade}}</td><td>{{part.score}}</td>
            </div>
          </div>
          <td v-show ="item.avgscore">{{item.avgscore}}</td>
          <td v-show ="item.numgrade">{{item.numgrade}}</td>
        </tr>
      </table>

    </div>
    <footer>MoodMe-Backend task. Developed by Lisha Xu</footer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return{
      flag: 0,
      queryValue:{
        name: null,
        picked: null,
        num_record: null,
        num_pages: null
      },
      info:{
        // address: {
        //   building: '',
        //   street: '',
        // },
        // cuisine: '',
        // grades: [{
        //   date: '',
        //   grade: '',
        //   score: '',
        // }],
        // name: '',
        // restaurant_id: '',
        // avgscore: '',
        // numgrade: Number
      }
    }
  },
  methods: {
    submit: function (event) {
      event.preventDefault();
      this.flag = 1;
      var queryValue = {...this.queryValue};
      console.log(queryValue);
      // axios.get("http://localhost:3000/",{params:this.queryValue}).then(res =>{
      axios.get("https://moodmeback.wl.r.appspot.com/",{params:this.queryValue}).then(res =>{
        this.info = res.data;
        console.log(this.info);
      })
    }
  },
  created() {
    this.flag = 0;
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
