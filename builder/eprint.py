import sys

error_counter = 0

def eprint(*args, **kwargs):
    global error_counter
    print(*args, file=sys.stderr, **kwargs)
    error_counter += 1
#    if error_counter > 80:
#        print("Too many errors!", file=sys.stderr)
#        sys.exit(1)
