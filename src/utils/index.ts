import { Karat } from "src/modules/order/schema/order.schema"

export const  parseKarat = (karat: Karat) => {
    switch (karat) {
      case Karat.K18:
        return 750
      case Karat.K21:
        return 875
      default:
        return 750
    }
  }