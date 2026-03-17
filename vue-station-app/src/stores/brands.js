import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import brandsApi from '../api/brandsApi'

export const useBrandsStore = defineStore('brandsStore', () => {
  const brands = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getEntries = computed(() => {
    return brands.value || []
  })

  const getOnlineBrands = computed(() => {
    return brands.value.filter(brand => brand.status === 'ON_LINE')
  })

  const getOfflineBrands = computed(() => {
    return brands.value.filter(brand => brand.status === 'OFF_LINE')
  })

  const fetchAllBrands = async () => {
    if (brands.value.length > 0) {
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      const response = await brandsApi.get('/aivox/info/all-brands')
      if (response?.data) {
        nextTick(() => {
          brands.value = response.data
        })
      } else {
        throw new Error('Invalid API response structure')
      }
    } catch (err) {
      nextTick(() => {
        error.value = err.message || 'Failed to fetch brands'
      })
      console.error('Error fetching brands:', err)
    } finally {
      loading.value = false
    }
  }

  const refreshBrands = async () => {
    brands.value = []
    await fetchAllBrands()
  }

  const getBrandById = computed(() => (id) => {
    return brands.value.find(brand => brand.id === id || brand.slugName === id)
  })

  const getBrandBySlug = computed(() => (slug) => {
    return brands.value.find(brand => brand.slugName === slug)
  })

  return {
    brands,
    loading,
    error,
    getEntries,
    getOnlineBrands,
    getOfflineBrands,
    fetchAll: fetchAllBrands,
    refresh: refreshBrands,
    getBrandById,
    getBrandBySlug
  }
})
