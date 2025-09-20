from typing import Dict, List, Any, Optional
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage, SystemMessage
import json

class PromptOptimizer:
    """Otimizador de prompts para LangChain"""
    
    def __init__(self):
        self.prompts = {}
        self._initialize_prompts()
    
    def _initialize_prompts(self):
        """Inicializa todos os prompts otimizados"""
        
        # Prompt para recomendações de viagem
        self.prompts['travel_recommendation'] = PromptTemplate(
            input_variables=[
                "user_preferences", "weather_data", "local_events", 
                "historical_bookings", "current_prices", "seasonal_trends"
            ],
            template="""
Você é um especialista em viagens e turismo com acesso a dados em tempo real.

CONTEXTO ATUAL:
- Preferências do usuário: {user_preferences}
- Dados climáticos: {weather_data}
- Eventos locais: {local_events}
- Histórico de reservas: {historical_bookings}
- Preços atuais: {current_prices}
- Tendências sazonais: {seasonal_trends}

INSTRUÇÕES:
1. Analise todos os dados fornecidos
2. Considere o clima atual e previsões
3. Identifique eventos relevantes próximos
4. Avalie preços e tendências
5. Forneça recomendações personalizadas

FORMATO DE RESPOSTA:
{{
    "recommendations": [
        {{
            "type": "accommodation|activity|restaurant|transport",
            "name": "Nome da recomendação",
            "description": "Descrição detalhada",
            "reasoning": "Por que esta recomendação",
            "weather_factor": "Como o clima influencia",
            "event_factor": "Como eventos locais influenciam",
            "price_factor": "Análise de preço",
            "priority": "high|medium|low"
        }}
    ],
    "weather_insights": "Análise do impacto do clima",
    "event_insights": "Análise de eventos relevantes",
    "price_insights": "Análise de preços e tendências",
    "risk_factors": ["Lista de fatores de risco"],
    "opportunities": ["Lista de oportunidades"]
}}

RESPONDA APENAS EM JSON VÁLIDO.
"""
        )
        
        # Prompt para análise de preços
        self.prompts['price_analysis'] = PromptTemplate(
            input_variables=[
                "current_price", "competitor_prices", "weather_forecast", 
                "event_schedule", "historical_data", "demand_trends"
            ],
            template="""
Você é um analista de preços especializado em turismo e hospitalidade.

DADOS DE ENTRADA:
- Preço atual: {current_price}
- Preços dos competidores: {competitor_prices}
- Previsão do tempo: {weather_forecast}
- Agenda de eventos: {event_schedule}
- Dados históricos: {historical_data}
- Tendências de demanda: {demand_trends}

ANÁLISE REQUERIDA:
1. Compare preços com competidores
2. Avalie impacto do clima na demanda
3. Considere eventos locais
4. Analise tendências históricas
5. Identifique oportunidades de otimização

RESPOSTA EM JSON:
{{
    "price_analysis": {{
        "current_position": "above|below|competitive",
        "competitor_comparison": {{
            "average_competitor_price": "valor",
            "price_difference": "diferença percentual",
            "market_position": "posição no mercado"
        }},
        "weather_impact": {{
            "demand_forecast": "alta|média|baixa",
            "price_recommendation": "aumentar|manter|diminuir",
            "reasoning": "explicação"
        }},
        "event_impact": {{
            "relevant_events": ["eventos relevantes"],
            "demand_spike": "sim|não",
            "price_opportunity": "oportunidade identificada"
        }},
        "historical_trends": {{
            "seasonal_pattern": "padrão sazonal",
            "price_volatility": "alta|média|baixa",
            "optimal_pricing_window": "janela de preço ideal"
        }},
        "recommendations": [
            {{
                "action": "ação recomendada",
                "reason": "justificativa",
                "expected_impact": "impacto esperado",
                "priority": "alta|média|baixa"
            }}
        ]
    }}
}}
"""
        )
        
        # Prompt para previsão de demanda
        self.prompts['demand_forecast'] = PromptTemplate(
            input_variables=[
                "historical_bookings", "weather_data", "events_data", 
                "seasonal_patterns", "market_trends", "special_events"
            ],
            template="""
Você é um especialista em previsão de demanda para turismo e hospitalidade.

DADOS HISTÓRICOS E ATUAIS:
- Reservas históricas: {historical_bookings}
- Dados climáticos: {weather_data}
- Eventos programados: {events_data}
- Padrões sazonais: {seasonal_patterns}
- Tendências de mercado: {market_trends}
- Eventos especiais: {special_events}

METODOLOGIA DE PREVISÃO:
1. Analise padrões históricos
2. Correlacione com dados climáticos
3. Considere impacto de eventos
4. Avalie tendências de mercado
5. Aplique fatores sazonais

PREVISÃO EM JSON:
{{
    "demand_forecast": {{
        "short_term": {{
            "next_7_days": {{
                "expected_bookings": "número",
                "confidence_level": "alta|média|baixa",
                "key_factors": ["fatores principais"]
            }},
            "next_30_days": {{
                "expected_bookings": "número",
                "confidence_level": "alta|média|baixa",
                "trend": "crescente|decrescente|estável"
            }}
        }},
        "medium_term": {{
            "next_90_days": {{
                "expected_bookings": "número",
                "seasonal_impact": "alto|médio|baixo",
                "peak_periods": ["períodos de pico"]
            }}
        }},
        "weather_correlation": {{
            "sunny_days_impact": "impacto de dias ensolarados",
            "rainy_days_impact": "impacto de dias chuvosos",
            "temperature_optimal": "temperatura ideal"
        }},
        "event_impact": {{
            "high_impact_events": ["eventos de alto impacto"],
            "demand_multiplier": "multiplicador de demanda",
            "duration_effect": "duração do efeito"
        }},
        "risk_factors": [
            {{
                "factor": "fator de risco",
                "probability": "probabilidade",
                "impact": "alto|médio|baixo"
            }}
        ],
        "opportunities": [
            {{
                "opportunity": "oportunidade",
                "timing": "momento ideal",
                "expected_benefit": "benefício esperado"
            }}
        ]
    }}
}}
"""
        )
        
        # Prompt para otimização de marketing
        self.prompts['marketing_optimization'] = PromptTemplate(
            input_variables=[
                "target_audience", "weather_conditions", "local_events", 
                "competitor_activity", "historical_performance", "current_campaigns"
            ],
            template="""
Você é um especialista em marketing digital para turismo e hospitalidade.

CONTEXTO DE MARKETING:
- Público-alvo: {target_audience}
- Condições climáticas: {weather_conditions}
- Eventos locais: {local_events}
- Atividade dos competidores: {competitor_activity}
- Performance histórica: {historical_performance}
- Campanhas atuais: {current_campaigns}

ESTRATÉGIA DE OTIMIZAÇÃO:
1. Identifique oportunidades baseadas no clima
2. Alinhe com eventos locais
3. Analise atividade dos competidores
4. Otimize campanhas existentes
5. Sugira novas abordagens

RECOMENDAÇÕES EM JSON:
{{
    "marketing_optimization": {{
        "weather_based_campaigns": [
            {{
                "weather_condition": "condição climática",
                "campaign_idea": "ideia da campanha",
                "target_audience": "público específico",
                "expected_roi": "ROI esperado",
                "timing": "momento ideal"
            }}
        ],
        "event_alignment": [
            {{
                "event": "evento local",
                "marketing_opportunity": "oportunidade",
                "campaign_type": "tipo de campanha",
                "budget_recommendation": "recomendação de orçamento"
            }}
        ],
        "competitive_analysis": {{
            "competitor_weaknesses": ["fraquezas dos competidores"],
            "market_gaps": ["lacunas no mercado"],
            "differentiation_opportunities": ["oportunidades de diferenciação"]
        }},
        "campaign_optimizations": [
            {{
                "current_campaign": "campanha atual",
                "optimization_suggestion": "sugestão de otimização",
                "expected_improvement": "melhoria esperada",
                "implementation_priority": "alta|média|baixa"
            }}
        ],
        "new_campaign_ideas": [
            {{
                "campaign_name": "nome da campanha",
                "concept": "conceito",
                "target_audience": "público-alvo",
                "budget_estimate": "estimativa de orçamento",
                "timeline": "cronograma",
                "success_metrics": ["métricas de sucesso"]
            }}
        ],
        "content_suggestions": [
            {{
                "content_type": "tipo de conteúdo",
                "theme": "tema",
                "weather_angle": "ângulo climático",
                "event_connection": "conexão com eventos",
                "platform": "plataforma ideal"
            }}
        ]
    }}
}}
"""
        )
    
    def get_prompt(self, prompt_type: str) -> PromptTemplate:
        """Retorna um prompt específico"""
        return self.prompts.get(prompt_type)
    
    def format_prompt(self, prompt_type: str, **kwargs) -> str:
        """Formata um prompt com os dados fornecidos"""
        prompt = self.get_prompt(prompt_type)
        if not prompt:
            raise ValueError(f"Prompt type '{prompt_type}' not found")
        
        return prompt.format(**kwargs)
    
    def get_system_message(self, role: str) -> SystemMessage:
        """Retorna uma mensagem do sistema para o LangChain"""
        system_messages = {
            'travel_expert': SystemMessage(content="""
Você é um especialista em viagens e turismo com mais de 15 anos de experiência.
Você tem acesso a dados em tempo real sobre clima, eventos, preços e tendências.
Sempre forneça recomendações baseadas em dados concretos e análise profunda.
Use linguagem clara e acionável para seus conselhos.
"""),
            'price_analyst': SystemMessage(content="""
Você é um analista de preços especializado em turismo e hospitalidade.
Você tem expertise em análise de mercado, preços dinâmicos e otimização de receita.
Sempre base suas análises em dados quantitativos e qualitativos.
Forneça insights acionáveis e recomendações específicas.
"""),
            'demand_forecaster': SystemMessage(content="""
Você é um especialista em previsão de demanda para turismo e hospitalidade.
Você tem experiência em análise de séries temporais e modelagem preditiva.
Sempre considere múltiplos fatores em suas previsões.
Forneça níveis de confiança e fatores de risco em suas análises.
"""),
            'marketing_specialist': SystemMessage(content="""
Você é um especialista em marketing digital para turismo e hospitalidade.
Você tem experiência em campanhas sazonais, marketing baseado em eventos e análise competitiva.
Sempre considere o contexto local e sazonal em suas recomendações.
Forneça estratégias específicas e mensuráveis.
""")
        }
        
        return system_messages.get(role, SystemMessage(content="Você é um assistente especializado."))
    
    def create_conversation_context(self, role: str, context_data: Dict[str, Any]) -> List:
        """Cria contexto de conversação para LangChain"""
        system_msg = self.get_system_message(role)
        context_str = json.dumps(context_data, indent=2, ensure_ascii=False)
        
        return [
            system_msg,
            HumanMessage(content=f"""
Com base no contexto fornecido, analise e responda de forma estruturada:

CONTEXTO:
{context_str}

Por favor, forneça uma análise detalhada e recomendações acionáveis.
""")
        ]

# Instância global do otimizador
prompt_optimizer = PromptOptimizer() 