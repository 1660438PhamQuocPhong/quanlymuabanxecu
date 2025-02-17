<template>
  <v-flex :class="{ 'pa-4': !isMobile }">
    <v-card flat v-if="receptionCustomerSells.length">
      <v-row no-gutters>
        <v-spacer></v-spacer>
        <v-col md="4" sm="6" cols="12">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>

        <v-col md="4" sm="6" cols="12" v-if="!isMobile">
          <v-select
            :items="itemsPerPageList"
            label="Item per page"
            v-model="itemsPerPage"
            class="ml-4"
          ></v-select>
        </v-col>
      </v-row>

      <v-layout
        v-resize="onResize"
        column
        class="table"
        :class="{ 'mt-4': isMobile }"
      >
        <v-responsive :aspect-ratio="$appConfig.aspectRatio.table">
          <v-simple-table :class="{ mobile: isMobile }">
            <template v-slot:default v-if="!isMobile">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Customer name</th>
                  <th>Customer phone</th>
                  <th>Progess transaction</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!loadData">
                    <td colspan="100%">
                      <skeleton-custom></skeleton-custom>
                    </td>
                </tr>

                <tr
                  v-for="(item, index) in receptionCustomerSells"
                  :key="item.id"
                  v-else
                >
                  <td>
                   {{ $helper.showIndex(index, currentPage, itemsPerPage) }}
                  </td>
                  <td>{{ item.customer.name }}</td>
                  <td>{{ item.customer.phoneNumber }}</td>
                  <td>
                    <v-chip
                      small
                      :color="$helper.colorStatusTransaction(item)"
                      dark
                    >
                      {{ item.status }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-btn
                      color="white"
                      small
                      class="primary mr-4"
                      @click="edit(item)"
                    >
                      <v-icon>mdi-square-edit-outline</v-icon>
                    </v-btn>
                    <v-btn color="white" small class="warning">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>

   <!--          <template v-slot:default v-else>
              <tr v-if="!loadData">
                    <td colspan="100%">
                       <skeleton-custom></skeleton-custom>
                    </td>
                </tr>
              <tr
                v-for="(item, index) in receptionCustomerSells"
                :key="item.id"
                v-if="loadData"
              >
                <td>
                  <ul class="flex-content">
                    <li class="flex-item" data-label="No.">
                     {{ $helper.showIndex(index, currentPage, itemsPerPage) }}
                    </li>
                    <li class="flex-item" data-label="Customer name">
                      {{ item.customer.name }}
                    </li>
                    <li class="flex-item" data-label="Customer phone">
                      {{ item.customer.phoneNumber }}
                    </li>
                    <li class="flex-item" data-label="Progess transaction">
                      <v-chip
                        small
                        :color="$helper.colorStatusTransaction(item)"
                        dark
                      >
                        {{ item.status }}
                      </v-chip>
                    </li>
                    <li class="flex-item" data-label="Action">
                      <v-btn
                        color="white"
                        small
                        class="primary mr-4"
                        @click="edit(item)"
                      >
                        <v-icon>mdi-square-edit-outline</v-icon>
                      </v-btn>
                      <v-btn color="white" small class="warning">
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </li>
                  </ul>
                </td>
              </tr>
            </template> -->
          </v-simple-table>
        </v-responsive>
      </v-layout>

      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-model="currentPage"
              class="my-4"
              :length="pageCounts"
              @input="nextPage"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
      <edit
        v-if="receptionSellEdit"
        :editDialog.sync="receptionSellEdit"
        :receptionCustomerSell.sync="receptionCustomerSell"
      >
      </edit>
    </v-card>
  </v-flex>
</template>

<script>
// store
import Modal from "@/store/models/modal";
import ReceptionCustomerSell from "@/store/models/reception_customer_sell";

// component
import EditComponent from "./Edit.vue";
import ComponentStore from "@/store/models/component";

export default {
  components: { edit: EditComponent },
  async created() {
    ComponentStore.dispatch("loadingProgress", { option: "show" });
    setTimeout(async () => {
      await this.retrieveData();
      ComponentStore.dispatch("loadingProgress", { option: "hide" });
    }, 500);
  },

  data() {
    return {
      currentPage: this.$appConfig.pagination.CURENT_PAGE,
      itemsPerPage: this.$appConfig.pagination.ITEMS_PER_PAGE,
      itemsPerPageList: this.$appConfig.pagination.ITEMS_PER_PAGE_LIST,
      pageCounts:  this.$appConfig.pagination.PAGE_COUNTS_DEFAULT,

      search: "",
      receptionCustomerSell: "",

      isMobile: false,
      loadData: false
    };
  },

  mounted() {


  },

  methods: {
    edit(item) {
      this.receptionCustomerSell = { ...item };
      Modal.dispatch("receptionSellEdit", { option: "show" });
    },

    nextPage(page) {
      this.currentPage = page;
      this.retrieveData();
    },

    async retrieveData() {

      const res = await ReceptionCustomerSell.api().fetchPaging(
        this.currentPage,
        this.itemsPerPage
      );
      if (res.response.status === 200) {
        this.loadData = true;
        this.pageCounts = res.response.data.pageCounts;
        ReceptionCustomerSell.insert({ data: res.response.data.data });
      }

    },

    onResize() {
      if (window.innerWidth < 769) this.isMobile = true;
      else this.isMobile = false;
    }
  },

  computed: {
    receptionCustomerSells() {
      var itemsPerPage = this.itemsPerPage;
      var offset = this.$helper.calcPagination(this.currentPage, itemsPerPage)

      return ReceptionCustomerSell.query()
        .with("employee")
        .with("customer")
        .with("vehicleTests", query => {
          query.with("vehicleType");
        })
        .offset(offset)
        .limit(itemsPerPage)
        .get();
    },

    receptionSellEdit() {
      return Modal.getters("receptionSellEdit");
    }
  }
};
</script>
