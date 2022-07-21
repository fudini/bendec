impl std::convert::From<foo::Foo> for bar::Foo {
  fn from(value: foo::Foo) -> Self {
    match value {
      foo::Foo::Variant1 => Self::Variant1,
      foo::Foo::Variant2 => Self::Variant2,
      foo::Foo::Variant3 => Self::Variant3,
    }
  }
}
impl std::convert::From<bar::Foo> for foo::Foo {
  fn from(value: bar::Foo) -> Self {
    match value {
      bar::Foo::Variant1 => Self::Variant1,
      bar::Foo::Variant2 => Self::Variant2,
      bar::Foo::Variant3 => Self::Variant3,
    }
  }
}

