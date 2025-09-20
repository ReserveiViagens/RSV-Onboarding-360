import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import json
import os

logger = logging.getLogger(__name__)

class MLPredictor:
    """Sistema de Machine Learning para previsões avançadas"""
    
    def __init__(self, models_dir: str = "models"):
        self.models_dir = models_dir
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        self.feature_importance = {}
        
        # Criar diretório de modelos se não existir
        os.makedirs(models_dir, exist_ok=True)
        
        # Inicializar modelos
        self._initialize_models()
    
    def _initialize_models(self):
        """Inicializa os modelos de ML"""
        
        # Modelo para previsão de demanda
        self.models['demand_forecast'] = {
            'random_forest': RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            ),
            'gradient_boosting': GradientBoostingRegressor(
                n_estimators=100,
                max_depth=6,
                random_state=42
            ),
            'linear_regression': LinearRegression()
        }
        
        # Modelo para previsão de preços
        self.models['price_prediction'] = {
            'random_forest': RandomForestRegressor(
                n_estimators=150,
                max_depth=12,
                random_state=42,
                n_jobs=-1
            ),
            'gradient_boosting': GradientBoostingRegressor(
                n_estimators=150,
                max_depth=8,
                random_state=42
            )
        }
        
        # Modelo para previsão de cancelamentos
        self.models['cancellation_prediction'] = {
            'random_forest': RandomForestRegressor(
                n_estimators=100,
                max_depth=8,
                random_state=42,
                n_jobs=-1
            )
        }
        
        # Inicializar scalers e encoders
        for model_type in self.models.keys():
            self.scalers[model_type] = StandardScaler()
            self.label_encoders[model_type] = {}
    
    def prepare_features(self, data: pd.DataFrame, model_type: str) -> pd.DataFrame:
        """Prepara features para treinamento"""
        
        df = data.copy()
        
        # Features temporais
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            df['day_of_week'] = df['date'].dt.dayofweek
            df['month'] = df['date'].dt.month
            df['quarter'] = df['date'].dt.quarter
            df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
            df['is_holiday'] = self._is_holiday(df['date'])
        
        # Features climáticas
        if 'weather' in df.columns:
            weather_encoder = LabelEncoder()
            df['weather_encoded'] = weather_encoder.fit_transform(df['weather'])
            self.label_encoders[model_type]['weather'] = weather_encoder
        
        # Features de localização
        if 'location' in df.columns:
            location_encoder = LabelEncoder()
            df['location_encoded'] = location_encoder.fit_transform(df['location'])
            self.label_encoders[model_type]['location'] = location_encoder
        
        # Features de eventos
        if 'events' in df.columns:
            df['has_events'] = df['events'].notna().astype(int)
            df['event_count'] = df['events'].str.count(',').fillna(0)
        
        # Features de preços
        if 'price' in df.columns:
            df['price_per_night'] = df['price'] / df['nights']
            df['price_category'] = pd.cut(
                df['price_per_night'], 
                bins=[0, 100, 200, 500, float('inf')], 
                labels=['low', 'medium', 'high', 'luxury']
            )
            price_encoder = LabelEncoder()
            df['price_category_encoded'] = price_encoder.fit_transform(df['price_category'])
            self.label_encoders[model_type]['price_category'] = price_encoder
        
        return df
    
    def _is_holiday(self, dates: pd.Series) -> pd.Series:
        """Verifica se as datas são feriados (simplificado)"""
        # Feriados brasileiros principais (simplificado)
        holidays = [
            '2024-01-01', '2024-04-21', '2024-05-01', '2024-09-07',
            '2024-10-12', '2024-11-02', '2024-11-15', '2024-12-25'
        ]
        holiday_dates = pd.to_datetime(holidays)
        return dates.isin(holiday_dates).astype(int)
    
    def train_demand_model(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Treina modelo de previsão de demanda"""
        
        logger.info("Iniciando treinamento do modelo de demanda")
        
        # Preparar features
        df = self.prepare_features(data, 'demand_forecast')
        
        # Features para demanda
        feature_columns = [
            'day_of_week', 'month', 'quarter', 'is_weekend', 'is_holiday',
            'weather_encoded', 'location_encoded', 'has_events', 'event_count',
            'price_per_night', 'price_category_encoded'
        ]
        
        # Remover colunas que não existem
        available_features = [col for col in feature_columns if col in df.columns]
        
        X = df[available_features].fillna(0)
        y = df['bookings']  # Assumindo que 'bookings' é a variável alvo
        
        # Dividir dados
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Normalizar features
        X_train_scaled = self.scalers['demand_forecast'].fit_transform(X_train)
        X_test_scaled = self.scalers['demand_forecast'].transform(X_test)
        
        results = {}
        
        # Treinar cada modelo
        for name, model in self.models['demand_forecast'].items():
            logger.info(f"Treinando modelo {name} para demanda")
            
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            
            # Métricas
            mse = mean_squared_error(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Feature importance (se disponível)
            importance = None
            if hasattr(model, 'feature_importances_'):
                importance = dict(zip(available_features, model.feature_importances_))
            
            results[name] = {
                'model': model,
                'mse': mse,
                'mae': mae,
                'r2': r2,
                'feature_importance': importance
            }
            
            logger.info(f"Modelo {name} - MSE: {mse:.4f}, MAE: {mae:.4f}, R²: {r2:.4f}")
        
        # Salvar melhor modelo
        best_model_name = max(results.keys(), key=lambda k: results[k]['r2'])
        self._save_model('demand_forecast', best_model_name, results[best_model_name])
        
        return results
    
    def train_price_model(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Treina modelo de previsão de preços"""
        
        logger.info("Iniciando treinamento do modelo de preços")
        
        # Preparar features
        df = self.prepare_features(data, 'price_prediction')
        
        # Features para preços
        feature_columns = [
            'day_of_week', 'month', 'quarter', 'is_weekend', 'is_holiday',
            'weather_encoded', 'location_encoded', 'has_events', 'event_count',
            'nights', 'guests'
        ]
        
        # Remover colunas que não existem
        available_features = [col for col in feature_columns if col in df.columns]
        
        X = df[available_features].fillna(0)
        y = df['price']
        
        # Dividir dados
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Normalizar features
        X_train_scaled = self.scalers['price_prediction'].fit_transform(X_train)
        X_test_scaled = self.scalers['price_prediction'].transform(X_test)
        
        results = {}
        
        # Treinar cada modelo
        for name, model in self.models['price_prediction'].items():
            logger.info(f"Treinando modelo {name} para preços")
            
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            
            # Métricas
            mse = mean_squared_error(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Feature importance
            importance = dict(zip(available_features, model.feature_importances_))
            
            results[name] = {
                'model': model,
                'mse': mse,
                'mae': mae,
                'r2': r2,
                'feature_importance': importance
            }
            
            logger.info(f"Modelo {name} - MSE: {mse:.4f}, MAE: {mae:.4f}, R²: {r2:.4f}")
        
        # Salvar melhor modelo
        best_model_name = max(results.keys(), key=lambda k: results[k]['r2'])
        self._save_model('price_prediction', best_model_name, results[best_model_name])
        
        return results
    
    def predict_demand(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Faz previsão de demanda"""
        
        # Carregar modelo se necessário
        model_info = self._load_model('demand_forecast')
        if not model_info:
            return {"error": "Modelo não treinado"}
        
        # Preparar features
        feature_vector = self._prepare_prediction_features(features, 'demand_forecast')
        
        # Fazer previsão
        prediction = model_info['model'].predict([feature_vector])[0]
        
        return {
            "predicted_demand": int(prediction),
            "confidence": self._calculate_confidence(model_info),
            "model_used": model_info['name'],
            "features_used": list(features.keys())
        }
    
    def predict_price(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Faz previsão de preços"""
        
        # Carregar modelo se necessário
        model_info = self._load_model('price_prediction')
        if not model_info:
            return {"error": "Modelo não treinado"}
        
        # Preparar features
        feature_vector = self._prepare_prediction_features(features, 'price_prediction')
        
        # Fazer previsão
        prediction = model_info['model'].predict([feature_vector])[0]
        
        return {
            "predicted_price": float(prediction),
            "confidence": self._calculate_confidence(model_info),
            "model_used": model_info['name'],
            "features_used": list(features.keys())
        }
    
    def _prepare_prediction_features(self, features: Dict[str, Any], model_type: str) -> List[float]:
        """Prepara features para previsão"""
        
        # Converter features para formato numérico
        feature_vector = []
        
        # Features temporais
        if 'date' in features:
            date = pd.to_datetime(features['date'])
            feature_vector.extend([
                date.dayofweek,
                date.month,
                date.quarter,
                1 if date.dayofweek in [5, 6] else 0,
                1 if self._is_holiday(pd.Series([date])).iloc[0] else 0
            ])
        
        # Features climáticas
        if 'weather' in features and 'weather' in self.label_encoders[model_type]:
            weather_encoded = self.label_encoders[model_type]['weather'].transform([features['weather']])[0]
            feature_vector.append(weather_encoded)
        
        # Features de localização
        if 'location' in features and 'location' in self.label_encoders[model_type]:
            location_encoded = self.label_encoders[model_type]['location'].transform([features['location']])[0]
            feature_vector.append(location_encoded)
        
        # Features de eventos
        feature_vector.extend([
            features.get('has_events', 0),
            features.get('event_count', 0)
        ])
        
        # Features de preços
        if 'price_per_night' in features:
            feature_vector.append(features['price_per_night'])
        
        # Features de reserva
        feature_vector.extend([
            features.get('nights', 1),
            features.get('guests', 1)
        ])
        
        # Normalizar features
        feature_vector = self.scalers[model_type].transform([feature_vector])[0]
        
        return feature_vector.tolist()
    
    def _calculate_confidence(self, model_info: Dict[str, Any]) -> float:
        """Calcula nível de confiança da previsão"""
        # Baseado no R² do modelo
        r2 = model_info.get('r2', 0.5)
        return min(max(r2, 0.1), 0.95)  # Entre 10% e 95%
    
    def _save_model(self, model_type: str, model_name: str, model_info: Dict[str, Any]):
        """Salva modelo treinado"""
        model_path = os.path.join(self.models_dir, f"{model_type}_{model_name}.joblib")
        scaler_path = os.path.join(self.models_dir, f"{model_type}_scaler.joblib")
        encoder_path = os.path.join(self.models_dir, f"{model_type}_encoders.json")
        
        # Salvar modelo
        joblib.dump(model_info['model'], model_path)
        
        # Salvar scaler
        joblib.dump(self.scalers[model_type], scaler_path)
        
        # Salvar encoders
        encoders_data = {}
        for name, encoder in self.label_encoders[model_type].items():
            encoders_data[name] = {
                'classes': encoder.classes_.tolist()
            }
        
        with open(encoder_path, 'w') as f:
            json.dump(encoders_data, f)
        
        # Salvar metadados
        metadata = {
            'model_name': model_name,
            'model_type': model_type,
            'r2': model_info['r2'],
            'mse': model_info['mse'],
            'mae': model_info['mae'],
            'feature_importance': model_info.get('feature_importance', {}),
            'created_at': datetime.now().isoformat()
        }
        
        metadata_path = os.path.join(self.models_dir, f"{model_type}_metadata.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        logger.info(f"Modelo {model_type}_{model_name} salvo com sucesso")
    
    def _load_model(self, model_type: str) -> Optional[Dict[str, Any]]:
        """Carrega modelo treinado"""
        try:
            # Procurar por modelos disponíveis
            model_files = [f for f in os.listdir(self.models_dir) if f.startswith(model_type)]
            
            if not model_files:
                return None
            
            # Carregar metadados para encontrar melhor modelo
            metadata_path = os.path.join(self.models_dir, f"{model_type}_metadata.json")
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    metadata = json.load(f)
                
                model_name = metadata['model_name']
                model_path = os.path.join(self.models_dir, f"{model_type}_{model_name}.joblib")
                scaler_path = os.path.join(self.models_dir, f"{model_type}_scaler.joblib")
                
                # Carregar modelo e scaler
                model = joblib.load(model_path)
                scaler = joblib.load(scaler_path)
                
                return {
                    'model': model,
                    'scaler': scaler,
                    'name': model_name,
                    'r2': metadata['r2'],
                    'mse': metadata['mse'],
                    'mae': metadata['mae']
                }
        
        except Exception as e:
            logger.error(f"Erro ao carregar modelo {model_type}: {str(e)}")
            return None
    
    def get_model_status(self) -> Dict[str, Any]:
        """Retorna status dos modelos"""
        status = {}
        
        for model_type in self.models.keys():
            model_info = self._load_model(model_type)
            if model_info:
                status[model_type] = {
                    'status': 'trained',
                    'model_name': model_info['name'],
                    'r2_score': model_info['r2'],
                    'last_updated': 'recent'
                }
            else:
                status[model_type] = {
                    'status': 'not_trained',
                    'model_name': None,
                    'r2_score': None,
                    'last_updated': None
                }
        
        return status

# Instância global do predictor
ml_predictor = MLPredictor() 