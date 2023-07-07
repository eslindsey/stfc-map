import sys
import json

class Loca:
    def __init__(self, file):
        self.data = {}
        self.keys = {}
        for loca in json.load(file):
            loca['id'] = str(loca['id'])
            if not loca['id'] in self.data:
                self.data[loca['id']] = {}
            self.data[loca['id']][loca['key']] = loca['text']
            self.keys[loca['key']] = True

def load(file):
    return Loca(file)

