# api/serializers.py

from rest_framework import serializers


# Serializer pour le message du chatbot 
#un peut theorie: le serializer est un outil qui permet de convertir des objets
# 
#  complexes (comme des instances de modèles Django) en formats de données simples 
# (comme JSON) et vice versa. Il est utilisé pour valider et transformer les données 
# entrantes et sortantes dans les API RESTful.
class ChatSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=500)
    user_id = serializers.IntegerField()
    analytics =serializers.JSONField(required=False)  # Champ optionnel pour les données d'analyse
    dataset = serializers.JSONBoundField(required=False)  # Champ optionnel pour les données de dataset
    