import { CondicaoPagamento } from "../../models/condicao-pagamento";

export let CONDICOES_PAGAMENTO : CondicaoPagamento[] | any = [
    {
      "id": 286,
      "numeroParcelas": 1,
      "descricao": "A VISTA",
      "percentualVariacao": 0,
      "parcelas": [
        {
          "id": 323,
          "numero": 1,
          "dias": 0,
          "percentualDistribuicao": 100
        }
      ]
    },
    {
      "id": 287,
      "numeroParcelas": 3,
      "descricao": "030/040/050 - Dias",
      "percentualVariacao": 0,
      "parcelas": [
        {
          "id": 223,
          "numero": 1,
          "dias": 30,
          "percentualDistribuicao": 33.33
        },
        {
          "id": 224,
          "numero": 2,
          "dias": 40,
          "percentualDistribuicao": 33.34
        },
        {
          "id": 225,
          "numero": 3,
          "dias": 50,
          "percentualDistribuicao": 33.33
        }
      ]
    },
    {
      "id": 423,
      "numeroParcelas": 3,
      "descricao": "030/060/090 - Dias",
      "percentualVariacao": 0,
      "parcelas": [
        {
          "id": 305,
          "numero": 1,
          "dias": 30,
          "percentualDistribuicao": 33.33
        },
        {
          "id": 306,
          "numero": 2,
          "dias": 60,
          "percentualDistribuicao": 33.34
        },
        {
          "id": 307,
          "numero": 3,
          "dias": 90,
          "percentualDistribuicao": 33.33
        }
      ]
    },
    {
      "id": 443,
      "numeroParcelas": 2,
      "descricao": "030/060 - Dias",
      "percentualVariacao": 0,
      "parcelas": [
        {
          "id": 466,
          "numero": 1,
          "dias": 30,
          "percentualDistribuicao": 50
        },
        {
          "id": 467,
          "numero": 2,
          "dias": 60,
          "percentualDistribuicao": 50
        }
      ]
    },
    {
      "id": 543,
      "numeroParcelas": 3,
      "descricao": "Entrada/030/060 - Dias",
      "percentualVariacao": 0,
      "parcelas": [
        {
          "id": 463,
          "numero": 1,
          "dias": 0,
          "percentualDistribuicao": 33.33
        },
        {
          "id": 464,
          "numero": 2,
          "dias": 30,
          "percentualDistribuicao": 33.34
        },
        {
          "id": 465,
          "numero": 3,
          "dias": 60,
          "percentualDistribuicao": 33.33
        }
      ]
    },
    {
      "id": 563,
      "numeroParcelas": 2,
      "descricao": "Entrada/030 - Dias",
      "percentualVariacao": 0,
      "parcelas": [
        {
          "id": 483,
          "numero": 1,
          "dias": 0,
          "percentualDistribuicao": 50
        },
        {
          "id": 484,
          "numero": 2,
          "dias": 30,
          "percentualDistribuicao": 50
        }
      ]
    },
    {
      "id": 663,
      "numeroParcelas": 4,
      "descricao": "030/060/090/120 - Dias",
      "percentualVariacao": 0,
      "parcelas": [
        {
          "id": 563,
          "numero": 1,
          "dias": 30,
          "percentualDistribuicao": 25
        },
        {
          "id": 564,
          "numero": 2,
          "dias": 60,
          "percentualDistribuicao": 25
        },
        {
          "id": 565,
          "numero": 3,
          "dias": 90,
          "percentualDistribuicao": 25
        },
        {
          "id": 566,
          "numero": 4,
          "dias": 120,
          "percentualDistribuicao": 25
        }
      ]
    }
];