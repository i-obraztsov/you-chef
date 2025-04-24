import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import qs from 'qs';

const mockResponse = "Название: Курочка по-провански с картофельной запеканкой\n Категория: ужин\n" +
    "Ингредиенты:\n" +
    "- Филе куриной грудки — 150 г\n" +
    "- Картофель средний — 2 шт.\n" +
    "- Чеснок — 2 зубчика\n" +
    "- Специи (розмарин сушеный, тимьян, черный перец, соль)\n" +
    "- Оливковое масло — 1 ст.л.\n" +
    "Инструкция:\n" +
    "1. Нарежьте филе курицы тонкими полосками поперек волокон.\n" +
    "2. Почистите картофель, порежьте кружочками толщиной около 4 мм.\n" +
    "3. Разогрейте духовку до 180 °C.\n" +
    "4. Выложите нарезанный картофель ровным слоем на противень, слегка сбрызните оливковым маслом, посыпьте солью, перцем, розмарином и измельченным чесноком.\n" +
    "5. Сверху разложите кусочки куриного филе, снова полейте небольшим количеством масла и присыпьте специями.\n" +
    "6. Запекайте блюдо примерно 25–30 минут до золотистой корочки картофеля и готовности мяса.\n" +
    "Изображение: нет изображения"

async function getToken() {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/api/v2/oauth',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      RqUID: uuidv4(),
    },
    data: qs.stringify({
      'scope': 'GIGACHAT_API_PERS'
    })
  };

  try {
    const response = await axios(config)
    const { access_token: accessToken, expires_at: expiresAt } = response.data

    return { accessToken, expiresAt }
  } catch (error) {
    console.log(error)
  }
}

export class GigaChatService {
  constructor() {
    this.baseUrl = '/api/v1/chat/completions';
  }

  async generateRecipe(ingredients) {
    const token = await getToken();
    try {
      const prompt = `
      На основе следующих ингредиентов: ${ingredients}, придумай оригинальный и вкусный рецепт.
      Порция должна быть рассчитана на одного человека.
      Ответ должен быть строго отформатирован в следующем виде:
      Название: [Название блюда]
      Категория: [Один из вариантов: завтрак / обед / ужин / перекус / десерт]
      Ингредиенты:
        [ингредиент 1]
        [ингредиент 2]
        ...
      Инструкция:
        [шаг 1]
        [шаг 2]
        ...
      Изображение: [ссылка на изображение блюда, если возможно. Если нет, напиши "нет изображения"]
      Не добавляй никакого текста вне указанного шаблона. Только сам рецепт по структуре. Пиши на русском языке.`
      
      const data = {
        model: "GigaChat-2-Max",
        messages: [
          {
            role: "user",
            content: prompt,
            attachments: []
          }
        ],
        profanity_check: true
      };

      const config = {
        method: 'post',
        url: this.baseUrl,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.accessToken}`
        },
        data: data
      };

      const response = await axios(config);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating recipe:', error);
      throw new Error('Failed to generate recipe');
    }
  }
}
