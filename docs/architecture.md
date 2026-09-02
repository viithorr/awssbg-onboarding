# Arquitetura do onboarding sbgUVV

## Responsabilidades

- **Next.js/Vercel:** interface pública, consulta segura, painel administrativo e endpoints exclusivamente server-side.
- **Supabase:** fonte oficial para candidatos, horários, reservas, avaliações e auditoria.
- **Google Calendar:** recebe apenas reservas confirmadas e cria o Google Meet.
- **E-mail:** inicialmente enviado pelo convite do Google Calendar; o acesso à consulta usa token seguro.

## Fluxo público

1. O frontend recebe somente `id` e `name` dos candidatos ativos.
2. Nome e e-mail são enviados ao servidor para validação.
3. O servidor normaliza o e-mail, aplica rate limit e devolve um token curto de verificação.
4. O frontend consulta os horários disponíveis com esse token.
5. A confirmação chama uma função transacional no banco, que impede concorrência por candidato e horário.
6. A reserva nasce como `pending`; o servidor cria Calendar/Meet e muda para `confirmed`.
7. Se o Google falhar, a reserva permanece protegida como `calendar_failed` e pode ser reprocessada pelo admin.

## Áreas

- `/`: agendamento público, mobile-first.
- `/onboarding/reserva/[token]`: consulta da reserva, resultado publicado e feedback público.
- `/admin`: horários, reservas, integrações e avaliações, protegido por Supabase Auth.

## Decisões de segurança

- Service Role e credenciais Google nunca chegam ao navegador.
- Tokens de consulta são aleatórios; apenas o hash é persistido.
- Observações internas e feedback público são campos distintos.
- Reservas não são apagadas: cancelamentos ficam no histórico.
- Datas são persistidas em `timestamptz` e exibidas em `America/Sao_Paulo`.
