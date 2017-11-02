var Chart = {
        template: '<div id="chart"></div>',
        props: ['columns'],
        watch: {
            columns: function(newVal, oldVal) {
                var chartData = newVal.slice(0);
                chartData.unshift('data');

                this.chart.load({
                    columns: [chartData],
                    unload: ['data'],
                });
            }
        },
        mounted: function() {
            this.chart = c3.generate({
                bindto: '#chart',
                data: {
                    columns: [
                        []
                    ],
                    type: 'bar'
                }
            });
        }
    },
    RegionSelector = {
        template: `<div>
                        <select v-model="currentRegion" @change="val => { $emit('changeRegion', currentRegion) }" class="form-control form-control-lg">
                            <option v-for="region in regions" :value="region.regionCode">{{region.regionName}}</option>
                        </select>
                    </div>`,
        props: ['regions'],
        events: ['changeRegion'],
        data: function() {
            return {
                currentRegion: -1
            }
        }
    };

new Vue({
    el: '#app',
    data: function() {
        return {
            regions:[],
            transactions: [],
            columns: []
        };
    },
    methods: {
        changeRegion: function(s) {
            this.columns = this.transactions.filter(function(i) { return i.region_id === s; }).map(function(i) { return i.amount; });
        }
    },
    components: {
        'chart-component': Chart,
            'region-selector': RegionSelector
    },
    template:  `<div>
                    <chart-component :columns="columns"></chart-component>
                    <region-selector :regions="regions" v-on:changeRegion="changeRegion"></region-selector>
                </div>`,
    created: function() {
        var self = this;

        // данные я выгрузил из свагера в json, потому что кросдомменные запросы запрещены на сервере.
        // надеюсь, что суть задачи я понял верно =)

        $.ajax({ url: '/data/regions.json', dataType: "json", success: function(data) {
            self.regions = data;
        }});
        $.ajax({ url: '/data/transactions.json', dataType: "json", success: function(data) {
            // сортирую по id
            self.transactions = data.sort(function(a, b) { return a.id - b.id; });
        }});
    }
});
