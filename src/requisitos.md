# 1. Crie o endpoint GET `/talker`

<ol>
<li> A requisição deve retornar o status 200 e um array com todas as pessoas palestrantes cadastradas.
<li> Caso não exista nenhuma pessoa palestrante cadastrada a requisição deve retornar o status 200 e um array vazio.
</ol>

# 2. Crie o endpoint GET `/talker/:id`
<ol>
<li> A requisição deve retornar o status 200 e uma pessoa palestrante com base no id da rota.
<li> Caso não seja encontrada uma pessoa palestrante com base no id da rota, a requisição deve retornar o status 404.
</ol>

# 3. Crie o endpoint POST `/login`. O endpoint deverá receber no corpo da requisição os campos email e password e retornar um token aleatório de 16 caracteres.

# 4. Adicione as validações para o endpoint `/login`. Os campos recebidos pela requisição devem ser validados e, caso os valores sejam inválidos, o endpoint deve retornar o código de status 400 com a respectiva mensagem de erro ao invés do token.

# 5. Crie o endpoint POST `/talker`.

# 6. Crie o endpoint PUT `/talker/:id`.

# 7. Crie o endpoint DELETE `/talker/:id`.

# 8. Crie o endpoint GET `/talker/search` e o parâmetro de consulta `q=searchTerm`.

# 9. Crie no endpoint GET `/talker/search` o parâmetro de consulta `rate=rateNumber`.

# 10. Crie no endpoint GET `/talker/search` o parâmetro de consulta `date=watchedDate`.

# 11. Crie o endpoint PATCH `/talker/rate/:id`.

# 12. Crie o endpoint GET `/talker/db`.