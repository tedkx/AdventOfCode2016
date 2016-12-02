using System;
using System.Collections.Generic;
using System.Linq;

class BathroomSecurity {
  #region Keypads
  
  static readonly string[][] Keypad1 = new string[3][] 
  {
    new string[] { "1", "2", "3" },
    new string[] { "4", "5", "6" },
    new string[] { "7", "8", "9" }
  };
  static readonly string[][] Keypad2 = new string[5][] 
  {
    new string[] { null, null, "1", null, null },
    new string[] { null, "2", "3", "4", null },
    new string[] { "5", "6", "7", "8", "9" },
    new string[] { null, "A", "B", "C", null },
    new string[] { null, null, "D", null, null },
  };
  
  #endregion
  
  static readonly Dictionary<char, Position> DirectionMatrix = new Dictionary<char, Position>()
  {
    { 'U', new Position(0, -1) },
    { 'R', new Position(1, 0) },
    { 'D', new Position(0, 1) },
    { 'L', new Position(-1, 0) },
  };
  
  private Position _currentPosition;
  private string _input;
  private string[][] _keypad;
  private int _keypadDimension;

  public BathroomSecurity(string input, KeypadType keypadType = KeypadType.Part1Keypad) 
  {
    switch(keypadType)
    {
      case KeypadType.Part1Keypad: 
        _keypad = Keypad1;
        _currentPosition = new Position(1, 1);
        break;
      case KeypadType.Part2Keypad:
        _keypad = Keypad2;
        _currentPosition = new Position(2, 0);
        break;
      default:
        throw new ArgumentException("Unsupported keypad type", "keypadType");
    }

    _keypadDimension = _keypad[0].Length;
    _input = input;
  }
  
  private bool Move(char direction) 
  {
    if(!DirectionMatrix.ContainsKey(direction))
        throw new ArgumentException("Invalid direction " + direction.ToString(), "direction");
      
    var newPos = _currentPosition + DirectionMatrix[direction];
    if(newPos.X < 0 || newPos.X >= _keypadDimension || newPos.Y < 0 || newPos.Y >= _keypadDimension)
      return false;
    if(_keypad[newPos.Y][newPos.X] == null)
      return false;
      
    _currentPosition = newPos;
    return true;
  }
  
  public string FindPassword() {
    var instructions = _input.Split('\n').Select(s => s.Trim()).ToArray();
    var password = new string[instructions.Length];

    for(var i = 0; i < instructions.Length; i++) 
    {
      foreach(char direction in instructions[i])
        Move(direction);
        
      password[i] = _keypad[_currentPosition.Y][_currentPosition.X];
    }
    
    return string.Join("", password);
  }
  
  public struct Position
  {
    public int X { get; set; }
    public int Y { get; set; }
    
    public Position(int x, int y)
      : this()
    {
      this.X = x;
      this.Y = y;
    }
    
    public static Position operator +(Position p1, Position p2) 
    {
      return new Position(p1.X + p2.X, p1.Y + p2.Y);
    }
  }
  
  public enum KeypadType
  {
    Part1Keypad = 1,
    Part2Keypad = 2,
  }
  
  public static void Main (string[] args) 
  {
    var input = @"ULL
                  RRDDD
                  LURDL
                  UUUUD";
    input = @"LRULLRLDUUUDUDDDRLUDRDLDDLUUDLDDLRDRLDRLLURRULURLDRLDUDURLURRULLDDDUDDRRRDLRRDDLDURDULLRDLLLDRDLLDULDUDLLDLDRUDLLDLDDRRRDRLUDRDDLUDRRDUDUDLLDDUUDLRDUDRRUDUDRULRULUDRUUDLDLULLRLDLDDRULLRLLLULUULDURURLUUULDURLDDDURRUUDURDDDULDLURLRDRURDRUDRLLDLDRUURLLLRDRURUDLRLUDULLDDURLRURDLRDUUURRLULRRLDDULUUURLRRRLLLLLURDDRUULUDRRRUDDLLULRRUULDRDDULRLDDDRRUULUDRLRUDURUUULDLDULUUDURLLLRRDDRDLURDDDLDDDLRDRLDDURLRLLRUDRRLLDDDDDURDURRDDULDULLRULDRUURDRRDUDDUDDDDRRDULDUURDRUDRLDULRULURLLRRDRDRDLUUDRRLRLDULDDLUUUUUURRLRRRULLDDDRLRDRRRRRRRDUUDLLUDURUDDLURRUDL
UDUUURRLRLLDDRRDRRRLDDDLURURLLUDDRLUUDRRRDURRLLRURDLLRRDUUDDDDRDRURRLLLLURDLRRRULLLDLLLUDDLDRRRDLDUUDDRDUDDUURDDLULULDURDURDRUULURURRURDUURUDRRUDRLLLLRRDLLDRDDRLLURDDDUDUDUDRUURDDRUURDLRUUDDRDUURUDDLLUURDLUDRUUDRRDLLUUURDULUULDUUDLLULUUDLUDRUUDUUURLDDDRLRURDDULLRDRULULUDLUUDDDUUDLDUUDRULLDUURDDRUDURULDRDDLRUULRRRDLDLRDULRDDRLLRRLURDLDRUDLRLUDLRLDLDURRUULRLUURDULDRRULLRULRDLLDLDUDRUDDUDLDDURDDDRDLUDRULRUULLRURLDDDRDLRRDRULURULDULRDLDULDURDRDRDRDURDRLUURLRDDLDDRLDDRURLLLURURDULDUDDLLUURDUUUDRUDDRDLDRLRLDURRULDULUUDDLRULDLRRRRDLLDRUUDRLLDLUDUULRDRDLRUUDLRRDDLUULDUULRUDRURLDDDURLRRULURR
LDURLLLRLLLUURLLULDLRLLDLURULRULRDUDLDDUDRLRRDLULLDDULUUULDRLDURURLURLDLRUDULLLULDUURLLRDLUULRULLLULRDRULUDLUUULDDURLUDDUDDRDLDRDRUDLUURDDLULDUULURLUULRDRDLURUDRUDLDRLUUUUULUDUDRRURUDRULDLDRDRLRURUUDRDLULLUDLLRUUDUUDUDLLRRRLDUDDDRDUDLDLLULRDURULLLUDLLRUDDUUDRLDUULLDLUUDUULURURLLULDUULLDLUDUURLURDLUULRRLLRUDRDLLLRRRLDDLUULUURLLDRDLUUULLDUDLLLLURDULLRUDUUULLDLRLDRLLULDUDUDRULLRRLULURUURLRLURRLRRRDDRLUDULURUDRRDLUDDRRDRUDRUDLDDRLRDRRLDDRLLDDDULDLRLDURRRRRULRULLUUULUUUDRRDRDRLLURRRRUULUDDUDDDLDURDRLDLLLLLRDUDLRDRUULU
URURRUUULLLLUURDULULLDLLULRUURRDRRLUULRDDRUDRRDUURDUDRUDDRUULURULDRLDRDDDLDLRLUDDRURULRLRLLLDLRRUDLLLLRLULDLUUDUUDRDLRRULLRDRLRLUUDDRRLLDDRULLLRLLURDLRRRRRLLDDRRDLDULDULLDLULLURURRLULRLRLLLLURDDRDDDUUDRRRDUUDDLRDLDRRLLRURUDUUUDLDUULLLRLURULRULRDRLLLDLDLRDRDLLLRUURDDUDDLULRULDLRULUURLLLRRLLLLLLRUURRLULRUUUDLDUDLLRRDDRUUUURRRDRRDULRDUUDULRRRDUUUUURRDUURRRRLDUDDRURULDDURDDRDLLLRDDURUDLLRURLRRRUDDLULULDUULURLUULRDLRDUDDRUULLLRURLDLRRLUDLULDRLUDDDRURUULLDLRLLLDULUDDRLRULURLRDRRDDLDLURUDDUUURRDDLUDDRDUULRRDLDRLLLULLRULRURULRLULULRDUD
RUDLLUDRRDRRLRURRULRLRDUDLRRLRDDUDRDLRRLLRURRDDLRLLRRURULRUULDUDUULDULDLRLRDLRDLRUURLDRLUDRRDDDRDRRRDDLLLRRLULLRRDDUDULRDRDUURLDLRULULUDLLDRUDUURRUDLLRDRLRRUUUDLDUDRRULLDURRDUDDLRURDLDRLULDDURRLULLRDDDRLURLULDLRUDLURDURRUDULDUUDLLLDDDUUURRRDLLDURRDLULRULULLRDURULLURDRLLRUUDDRRUDRDRRRURUUDLDDRLDRURULDDLLULULURDLDLDULLRLRDLLUUDDUDUDDDDRURLUDUDDDRRUDDLUDULLRDLDLURDDUURDLRLUUDRRULLRDLDDDLDULDUDRDUUULULDULUDLULRLRUULLDURLDULDRDLLDULLLULRLRD";

    var answer1 = new BathroomSecurity(input, KeypadType.Part1Keypad).FindPassword();
    Console.WriteLine(answer1);
    
    var answer2 = new BathroomSecurity(input, KeypadType.Part2Keypad).FindPassword();
    Console.WriteLine(answer2);
  }
}
      